import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageData } from "@/types";
import { AvatarStack } from "@/components/ui/avatar-stack";

export interface ChatMessageProps
  extends React.HTMLAttributes<HTMLDivElement> {
  message: ChatMessageData;
}

/** A single chat bubble row (Figma "Chat Component"). */
export function ChatMessage({ message, className, ...props }: ChatMessageProps) {
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
          "flex max-w-[75%] flex-col gap-1 rounded-card px-4 py-3",
          own
            ? "rounded-tr-sm bg-gradient-brand"
            : "rounded-tl-sm bg-glass-purple shadow-card-inner",
        )}
      >
        <div className="flex items-baseline gap-2">
          <p className="text-sm font-semibold text-white">
            {message.author.name}
          </p>
          {message.sentAt ? (
            <p className="text-[10px] text-white/60">{message.sentAt}</p>
          ) : null}
        </div>
        <p className="text-sm text-white">{message.content}</p>
      </div>
    </div>
  );
}
