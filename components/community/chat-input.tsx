"use client";

import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CommunityChatTheme } from "@/lib/community-chat-theme";

export interface ChatInputProps {
  placeholder?: string;
  disabled?: boolean;
  onSend?: (message: string) => void;
  theme?: CommunityChatTheme;
  className?: string;
}

/** Message composer bar with accent-themed glass styling. */
export function ChatInput({
  placeholder = "Send a message...",
  disabled = false,
  onSend,
  theme,
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
        "flex h-14 w-full items-center gap-3 rounded-2xl px-4",
        className,
      )}
      style={theme?.composer}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="h-full flex-1 bg-transparent text-sm font-medium placeholder:text-white/55 focus:outline-none"
        style={{
          color: theme?.bodyText ?? "white",
        }}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition-all hover:scale-[1.03] disabled:pointer-events-none disabled:opacity-40"
        style={theme?.composerButton}
      >
        <SendHorizontal className="size-4" />
      </button>
    </form>
  );
}
