import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/appoint-funnels-logo.png.asset.json";

const transport = new DefaultChatTransport({ api: "/api/chat" });

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { messages, sendMessage, status, stop, error } = useChat({ transport });
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (open && !busy) textareaRef.current?.focus();
  }, [open, busy, messages.length]);

  return (
    <div className="fixed bottom-5 right-5 z-[60]">
      <AnimatePresence>
        {open && (
          <motion.section
            aria-label="Appoint Funnels assistant"
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97 }}
            className="mb-3 flex h-[min(36rem,72vh)] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-[var(--shadow-soft)]"
          >
            <header className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <img src={logoAsset.url} alt="" className="h-9 w-9 rounded-lg object-cover" />
                <div>
                  <h2 className="text-sm font-semibold">Appoint Funnels</h2>
                  <p className="text-xs text-muted-foreground">Ask about your growth plan</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close assistant">
                <X />
              </Button>
            </header>

            <Conversation className="min-h-0">
              <ConversationContent className="gap-5 p-4">
                {messages.length === 0 && (
                  <div className="my-auto px-3 text-center">
                    <img src={logoAsset.url} alt="Appoint Funnels" className="mx-auto h-14 w-14 rounded-xl object-cover" />
                    <p className="mt-4 text-sm font-semibold">How can we help?</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Ask about pricing, outreach channels, guarantees, or your calculator results.
                    </p>
                  </div>
                )}
                {messages.map((message) => (
                  <Message key={message.id} from={message.role}>
                    <MessageContent>
                      {message.parts.map((part, index) =>
                        part.type === "text" ? (
                          <MessageResponse key={`${message.id}-${index}`}>{part.text}</MessageResponse>
                        ) : null,
                      )}
                    </MessageContent>
                  </Message>
                ))}
                {status === "submitted" && <Shimmer className="text-xs">Thinking...</Shimmer>}
                {error && (
                  <p className="rounded-md border border-destructive/50 p-3 text-xs text-destructive">
                    {error.message || "The assistant could not respond. Please try again."}
                  </p>
                )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>

            <div className="border-t border-border p-3">
              <PromptInput
                onSubmit={async ({ text }) => {
                  if (!text.trim() || busy) return;
                  await sendMessage({ text: text.trim() });
                }}
              >
                <PromptInputTextarea ref={textareaRef} placeholder="Ask Appoint Funnels…" className="min-h-20" />
                <PromptInputFooter className="justify-end">
                  <PromptInputSubmit status={status} onStop={stop} />
                </PromptInputFooter>
              </PromptInput>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <Button
        type="button"
        size="icon"
        aria-label={open ? "Close assistant" : "Open assistant"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="ml-auto h-14 w-14 rounded-full shadow-[var(--glow-brand)]"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </Button>
    </div>
  );
}