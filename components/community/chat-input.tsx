"use client";

import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChatInputProps {
  placeholder?: string;
  disabled?: boolean;
  onSend?: (message: string) => void;
  className?: string;
}

/** Message composer bar (Figma "ChatBox Component", 72px tall). */
export function ChatInput({
  placeholder = "Send a message...",
  disabled = false,
  onSend,
  className,
}: ChatInputProps) {
  const [value, setValue] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const message = value.trim();
    if (!message) return;
    onSend?.(message);
    setValue("");
  }

  return (
    <form
      onSubmit={submit}
      className={cn(
        "flex h-14 w-full items-center gap-3 rounded-btn bg-glass-purple px-4 shadow-card-inner",
        className,
      )}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="h-full flex-1 bg-transparent text-sm text-white placeholder:text-muted/60 focus:outline-none"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-gradient-brand text-white transition-all hover:shadow-glow-pink-soft disabled:pointer-events-none disabled:opacity-40"
      >
        <SendHorizontal className="size-4" />
      </button>
    </form>
  );
}
