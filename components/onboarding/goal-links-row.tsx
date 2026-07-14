import Link from "next/link";
import type { OnboardingGoalLink } from "@/lib/data/onboarding";

export interface GoalLinksRowProps {
  links: OnboardingGoalLink[];
}

/** Quick dashboard shortcuts based on onboarding goals. */
export function GoalLinksRow({ links }: GoalLinksRowProps) {
  if (!links.length) return null;

  return (
    <section className="flex w-full flex-col gap-3">
      <h3 className="px-2 text-base font-bold text-white sm:text-lg">
        🚀 Start With What You Picked
      </h3>
      <div className="flex flex-wrap gap-2 px-2">
        {links.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className="flex items-center gap-2 rounded-full border border-brand-magenta/60 bg-glass-magenta px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-magenta/15 sm:text-sm"
          >
            <span aria-hidden>{link.emoji}</span>
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
