import { cn } from "@/lib/utils";
import type { CommunityChatTheme } from "@/lib/community-chat-theme";
import type { ChatMessage as ChatMessageData } from "@/types";
import { AvatarStack } from "@/components/ui/avatar-stack";

export interface ChatMessageProps
  extends React.HTMLAttributes<HTMLDivElement> {
  message: ChatMessageData;
  theme?: CommunityChatTheme;
}

/** A single chat bubble row with accent-themed glass styling. */
export function ChatMessage({
  message,
  theme,
  className,
  ...props
}: ChatMessageProps) {
  const own = message.own ?? false;

  return (
    <div
      className={cn(
        "flex w-full items-start gap-3",
        own && "flex-row-reverse",
        className,
      )}
      {...props}
    >
      <AvatarStack users={[message.author]} size="sm" />
      <div
        className={cn(
          "flex max-w-[min(75%,28rem)] flex-col gap-1.5 rounded-2xl px-4 py-3 ring-1 ring-white/[0.04]",
          own ? "rounded-tr-md" : "rounded-tl-md",
        )}
        style={own ? theme?.bubbleOwn : theme?.bubbleOther}
      >
        <div
          className={cn(
            "flex flex-wrap items-baseline gap-x-2 gap-y-0.5",
            own && "flex-row-reverse",
          )}
        >
          <p
            className="text-sm font-semibold"
            style={{
              color: own ? "rgba(255,255,255,0.98)" : theme?.accentText,
              textShadow: own ? "0 1px 2px rgba(0,0,0,0.35)" : undefined,
            }}
          >
            {message.author.name}
          </p>
          {message.sentAt ? (
            <p
              className="text-[10px] font-medium"
              style={{ color: theme?.mutedText ?? "rgba(255,255,255,0.6)" }}
            >
              {message.sentAt}
            </p>
          ) : null}
        </div>
        <p
          className="text-sm leading-relaxed"
          style={{
            color: theme?.bodyText ?? "white",
            textShadow: own ? "0 1px 2px rgba(0,0,0,0.3)" : undefined,
          }}
        >
          {message.content}
        </p>
      </div>
    </div>
  );
}
