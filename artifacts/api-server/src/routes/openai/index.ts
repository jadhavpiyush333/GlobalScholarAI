import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, conversations, messages, universities, programs, visaRequirements } from "@workspace/db";
import { openai } from "@workspace/integrations-openai-ai-server";
import {
  CreateOpenaiConversationBody,
  SendOpenaiMessageBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/conversations", async (_req, res) => {
  const list = await db
    .select()
    .from(conversations)
    .orderBy(conversations.createdAt);
  res.json(list);
});

router.post("/conversations", async (req, res) => {
  const body = CreateOpenaiConversationBody.parse(req.body);
  const [conv] = await db.insert(conversations).values(body).returning();
  res.status(201).json(conv);
});

router.get("/conversations/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [conv] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, id));
  if (!conv) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }
  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(asc(messages.createdAt));
  res.json({ ...conv, messages: msgs });
});

router.delete("/conversations/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [conv] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, id));
  if (!conv) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }
  await db.delete(conversations).where(eq(conversations.id, id));
  res.status(204).send();
});

router.get("/conversations/:id/messages", async (req, res) => {
  const id = Number(req.params.id);
  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(asc(messages.createdAt));
  res.json(msgs);
});

router.post("/conversations/:id/messages", async (req, res) => {
  const id = Number(req.params.id);
  const body = SendOpenaiMessageBody.parse(req.body);

  const [conv] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, id));
  if (!conv) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }

  // Save user message
  await db.insert(messages).values({
    conversationId: id,
    role: "user",
    content: body.content,
  });

  // Fetch knowledge base context for RAG
  const unis = await db.select().from(universities).limit(20);
  const progs = await db.select().from(programs).limit(30);
  const visas = await db.select().from(visaRequirements).limit(20);

  const knowledgeContext = buildKnowledgeContext(unis, progs, visas);

  // Fetch conversation history
  const history = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(asc(messages.createdAt));

  const systemPrompt = `You are a knowledgeable and helpful Study Abroad Counselor AI. You assist students with questions about international university admissions and student visa requirements.

CRITICAL INSTRUCTIONS:
- You MUST only answer based on the knowledge base provided below. Do NOT make up or hallucinate any university names, visa requirements, deadlines, tuition fees, or other factual data.
- If the student's question cannot be answered from the knowledge base, say: "I don't have that specific information in my knowledge base. Please verify this with the official university or embassy website."
- Always cite the source (university or country) when providing deadline or requirement information.
- For visa information, always remind students to verify with the official embassy or consulate.
- Be warm, supportive, and encouraging.

--- KNOWLEDGE BASE ---
${knowledgeContext}
--- END KNOWLEDGE BASE ---`;

  const chatMessages = [
    { role: "system" as const, content: systemPrompt },
    ...history.slice(0, -1).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content: body.content },
  ];

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullResponse = "";

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: chatMessages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    // Save assistant message
    await db.insert(messages).values({
      conversationId: id,
      role: "assistant",
      content: fullResponse,
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  } catch (err) {
    console.error("OpenAI streaming error:", err);
    res.write(`data: ${JSON.stringify({ error: "Failed to generate response" })}\n\n`);
  }

  res.end();
});

function buildKnowledgeContext(
  unis: typeof universities.$inferSelect[],
  progs: typeof programs.$inferSelect[],
  visas: typeof visaRequirements.$inferSelect[]
): string {
  let ctx = "";

  if (unis.length > 0) {
    ctx += "UNIVERSITIES:\n";
    for (const u of unis) {
      ctx += `- ${u.name} (${u.city}, ${u.country})`;
      if (u.ranking) ctx += ` | World Ranking: #${u.ranking}`;
      if (u.website) ctx += ` | Website: ${u.website}`;
      if (u.description) ctx += `\n  Description: ${u.description}`;
      ctx += "\n";

      const uniPrograms = progs.filter((p) => p.universityId === u.id);
      if (uniPrograms.length > 0) {
        ctx += "  Programs:\n";
        for (const p of uniPrograms) {
          ctx += `    * ${p.name} (${p.degree}, ${p.duration}, Language: ${p.language})`;
          if (p.tuitionPerYear) ctx += ` | Tuition: ${p.tuitionPerYear}/year`;
          if (p.applicationDeadline) ctx += ` | Deadline: ${p.applicationDeadline}`;
          if (p.ieltsMin) ctx += ` | IELTS min: ${p.ieltsMin}`;
          if (p.toeflMin) ctx += ` | TOEFL min: ${p.toeflMin}`;
          if (p.requirements) ctx += `\n      Requirements: ${p.requirements}`;
          ctx += "\n";
        }
      }
    }
    ctx += "\n";
  }

  if (visas.length > 0) {
    ctx += "STUDENT VISA REQUIREMENTS BY COUNTRY:\n";
    for (const v of visas) {
      ctx += `- ${v.country} — ${v.visaType}:\n`;
      ctx += `  Requirements: ${v.requirements}\n`;
      if (v.processingTime) ctx += `  Processing Time: ${v.processingTime}\n`;
      if (v.fees) ctx += `  Fees: ${v.fees}\n`;
      if (v.proofOfFunds) ctx += `  Proof of Funds: ${v.proofOfFunds}\n`;
      if (v.notes) ctx += `  Notes: ${v.notes}\n`;
    }
    ctx += "\n";
  }

  return ctx || "No knowledge base data available.";
}

export default router;
