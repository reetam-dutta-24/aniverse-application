import { cn } from "@/lib/utils";
import { avatarColors } from "@/lib/accents";
import type { UserSummary } from "@/types";

export interface AvatarStackProps extends React.HTMLAttributes<HTMLDivElement> {
  users: UserSummary[];
  /** Max avatars to render before collapsing into the trailing label. */
  max?: number;
  /** Trailing label, e.g. "+20" or "....42k+". Auto-derived when omitted. */
  overflowLabel?: string;
  size?: "sm" | "md";
}

/** Row of colored initial circles (Figma "UserProfile Display"). */
export function AvatarStack({
  users,
  max = 3,
  overflowLabel,
  size = "md",
  className,
  ...props
}: AvatarStackProps) {
  const visible = users.slice(0, max);
  const hidden = users.length - visible.length;
  const label =
    overflowLabel ?? (hidden > 0 ? `+${hidden}` : undefined);

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      {...props}
    >
      {visible.map((user, i) => (
        <span
          key={user.id}
          className={cn(
            "flex items-center justify-center overflow-hidden rounded-full text-center font-semibold text-black",
            size === "md" ? "size-10 text-lg" : "size-7 text-sm",
          )}
          style={{
            backgroundColor:
              user.avatarColor ?? avatarColors[i % avatarColors.length],
          }}
          title={user.name}
        >
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="size-full object-cover"
            />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </span>
      ))}
      {label ? (
        <span className="ms-1.5 text-lg font-semibold text-white">{label}</span>
      ) : null}
    </div>
  );
}
