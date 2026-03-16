import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { User, Sparkles } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isAssistant = role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`py-6 px-4 md:px-8 w-full ${isAssistant ? "bg-muted/30 border-y border-border/50" : "bg-background"}`}
    >
      <div className="max-w-4xl mx-auto flex gap-4 md:gap-6">
        <div className="flex-shrink-0">
          {isAssistant ? (
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
          ) : (
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-accent flex items-center justify-center shadow-md">
              <User className="w-5 h-5 text-accent-foreground" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0 prose prose-sm md:prose-base prose-slate dark:prose-invert max-w-none">
          {content ? (
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({node, ...props}) => (
                  <div className="overflow-x-auto my-4 border border-border rounded-lg">
                    <table className="min-w-full divide-y divide-border m-0" {...props} />
                  </div>
                ),
                th: ({node, ...props}) => <th className="px-4 py-3 bg-muted text-left text-sm font-semibold" {...props} />,
                td: ({node, ...props}) => <td className="px-4 py-3 text-sm border-t border-border" {...props} />,
                a: ({node, ...props}) => <a className="text-primary hover:text-accent underline" {...props} />
              }}
            >
              {content}
            </ReactMarkdown>
          ) : isStreaming ? (
            <div className="flex items-center gap-1 h-6">
              <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 rounded-full bg-primary/80 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
