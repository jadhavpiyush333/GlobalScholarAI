import { useState, useRef, useEffect } from "react";
import { useSearch } from "wouter";
import { Send, ArrowRight, Lightbulb } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { ChatMessage } from "@/components/chat/chat-message";
import { useChatStream } from "@/hooks/use-chat-stream";
import { 
  useGetOpenaiConversation, 
  useCreateOpenaiConversation, 
  useListOpenaiMessages 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListOpenaiConversationsQueryKey } from "@workspace/api-client-react";

const SUGGESTIONS = [
  "What are the visa requirements for studying in the UK?",
  "List top computer science programs in Germany.",
  "How much proof of funds do I need for Canada?",
  "What are the IELTS requirements for University of Oxford?"
];

export function ChatPage() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const idParam = searchParams.get("id");
  const conversationId = idParam ? parseInt(idParam) : null;

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const queryClient = useQueryClient();
  const createConvo = useCreateOpenaiConversation();
  
  // Data Fetching
  const { data: conversation } = useGetOpenaiConversation(conversationId || 0, {
    query: { enabled: !!conversationId }
  });
  
  const { data: messages = [], isLoading: isLoadingMessages } = useListOpenaiMessages(conversationId || 0, {
    query: { enabled: !!conversationId }
  });

  const { sendMessage, isStreaming, streamText } = useChatStream(conversationId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamText]);

  const handleSubmit = async (e?: React.FormEvent, overrideText?: string) => {
    if (e) e.preventDefault();
    const textToSend = overrideText || input;
    if (!textToSend.trim() || isStreaming) return;

    setInput("");

    // If no conversation exists, create one first
    let activeConvId = conversationId;
    if (!activeConvId) {
      try {
        const result = await createConvo.mutateAsync({ 
          data: { title: textToSend.slice(0, 30) + "..." } 
        });
        activeConvId = result.id;
        queryClient.invalidateQueries({ queryKey: getListOpenaiConversationsQueryKey() });
        // Update URL without full reload (pushState)
        window.history.pushState({}, "", `/?id=${activeConvId}`);
        // We trigger an event so wouter notices the URL change
        window.dispatchEvent(new Event("popstate"));
      } catch (err) {
        console.error("Failed to create conversation:", err);
        return;
      }
    }

    // Since we might have just created it, we need to wait a tick or use the hook directly.
    // In our setup, useChatStream depends on conversationId prop. 
    // If it just changed, the hook might not have the new ID immediately in this closure.
    // So we'll fetch manually or ensure the hook is updated.
    // For simplicity, if we created it just now, we'll reload the page to that ID to be safe
    if (!conversationId && activeConvId) {
      window.location.href = `/?id=${activeConvId}&initMsg=${encodeURIComponent(textToSend)}`;
      return;
    }

    await sendMessage(textToSend);
  };

  // Handle auto-send after redirect
  useEffect(() => {
    const initMsg = searchParams.get("initMsg");
    if (initMsg && conversationId && messages.length === 0 && !isStreaming) {
      // Clear initMsg from URL
      window.history.replaceState({}, "", `/?id=${conversationId}`);
      sendMessage(initMsg);
    }
  }, [conversationId, messages.length, searchParams, sendMessage, isStreaming]);

  const showEmptyState = !conversationId || (messages.length === 0 && !isStreaming);

  return (
    <MainLayout>
      <div className="flex flex-col h-full w-full">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto w-full">
          {showEmptyState ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center max-w-3xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-border">
                <img 
                  src={`${import.meta.env.BASE_URL}images/avatar-bot.png`} 
                  alt="AI Counselor" 
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
                Your Expert Study Abroad Counselor
              </h1>
              <p className="text-lg text-muted-foreground mb-12 max-w-xl">
                I can help you explore universities, understand visa requirements, and navigate admission deadlines securely from our verified knowledge base.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl text-left">
                {SUGGESTIONS.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSubmit(undefined, suggestion)}
                    className="flex flex-col p-4 bg-card hover:bg-accent/5 border border-border hover:border-accent transition-all rounded-2xl shadow-sm hover:shadow-md text-left group"
                  >
                    <Lightbulb className="w-5 h-5 text-accent mb-2 group-hover:text-primary transition-colors" />
                    <span className="text-sm font-medium text-card-foreground">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="pb-32 w-full">
              {messages.map((msg) => (
                <ChatMessage 
                  key={msg.id} 
                  role={msg.role as "user" | "assistant"} 
                  content={msg.content} 
                />
              ))}
              
              {isStreaming && (
                <ChatMessage 
                  role="assistant" 
                  content={streamText} 
                  isStreaming={true} 
                />
              )}
              
              {isLoadingMessages && messages.length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent pt-10 pb-6 px-4">
          <div className="max-w-4xl mx-auto">
            <form 
              onSubmit={handleSubmit}
              className="relative flex items-end bg-card rounded-3xl border border-border/60 shadow-lg shadow-black/5 overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Ask about universities, visas, or deadlines..."
                className="w-full max-h-48 min-h-[60px] py-4 pl-6 pr-14 bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-foreground placeholder:text-muted-foreground"
                rows={1}
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="absolute right-3 bottom-3 p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary transition-colors flex items-center justify-center shadow-sm"
              >
                {isStreaming ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
              </button>
            </form>
            <p className="text-center text-xs text-muted-foreground mt-3">
              AI responses are based strictly on our verified university knowledge base.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
