import { useState, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getListOpenaiMessagesQueryKey } from "@workspace/api-client-react";

interface StreamState {
  isStreaming: boolean;
  streamText: string;
  error: string | null;
}

export function useChatStream(conversationId: number | null) {
  const [state, setState] = useState<StreamState>({
    isStreaming: false,
    streamText: "",
    error: null,
  });
  
  const queryClient = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!conversationId) return;

    // Cancel any ongoing stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setState({ isStreaming: true, streamText: "", error: null });

    try {
      const response = await fetch(`/api/openai/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("No response body available");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          setState(prev => ({ ...prev, isStreaming: false }));
          // Invalidate messages list to fetch the official persisted versions
          queryClient.invalidateQueries({
            queryKey: getListOpenaiMessagesQueryKey(conversationId)
          });
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.replace("data: ", "").trim();
            if (!dataStr) continue;

            try {
              const data = JSON.parse(dataStr);
              if (data.done) {
                // Done event handled by stream close above
              } else if (data.content) {
                accumulatedText += data.content;
                setState(prev => ({ ...prev, streamText: accumulatedText }));
              }
            } catch (e) {
              console.warn("Failed to parse SSE chunk:", dataStr);
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Stream aborted");
      } else {
        console.error("Chat stream error:", err);
        setState(prev => ({ ...prev, error: err.message, isStreaming: false }));
      }
    } finally {
      abortControllerRef.current = null;
    }
  }, [conversationId, queryClient]);

  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setState(prev => ({ ...prev, isStreaming: false }));
      if (conversationId) {
        queryClient.invalidateQueries({
          queryKey: getListOpenaiMessagesQueryKey(conversationId)
        });
      }
    }
  }, [conversationId, queryClient]);

  return {
    ...state,
    sendMessage,
    stopStream
  };
}
