"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clapperboard,
  Sparkles,
} from "lucide-react";
import { ArtistCard } from "@/components/cards/artist-card";
import { CollectionCard } from "@/components/cards/collection-card";
import { CommunityCard } from "@/components/cards/community-card";
import { MusicCard } from "@/components/cards/music-card";
import { PosterCard } from "@/components/cards/poster-card";
import { GoalLinksRow } from "@/components/onboarding/goal-links-row";
import { TasteBreakdownPanel } from "@/components/onboarding/taste-breakdown-panel";
import { Chip } from "@/components/ui/chip";
import { GradientButton } from "@/components/ui/gradient-button";
import {
  buildOnboardingRecommendations,
  emptyOnboardingSelection,
  onboardingSteps,
  type OnboardingRecommendations,
  type OnboardingSelection,
} from "@/lib/data/onboarding";
import { getOnboardingProfile, saveOnboardingProfile } from "@/lib/onboarding-store";
import { sectionTintSeed } from "@/lib/card-theme";
import { cn } from "@/lib/utils";

type Phase = "intro" | "quiz" | "building" | "results";

const buildingSteps = [
  "Reading your genre picks…",
  "Matching anime & shows…",
  "Tuning music & OSTs…",
  "Finding communities…",
  "Building your taste profile…",
];

function CardRow({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full flex-col gap-3">
      <h3 className="px-2 text-base font-bold text-white sm:text-lg">{title}</h3>
      <div className="flex flex-nowrap items-start gap-3 overflow-x-auto px-2 py-1 sm:gap-5">
        {children}
      </div>
    </section>
  );
}

/** Post-signup taste test — picks preferences, then previews the matched universe. */
export function OnboardingFlow({ userName }: { userName: string }) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [selection, setSelection] = useState<OnboardingSelection>(
    emptyOnboardingSelection,
  );
  const [phase, setPhase] = useState<Phase>("intro");
  const [isRetake, setIsRetake] = useState(false);
  const [buildingStep, setBuildingStep] = useState(0);
  const [recommendations, setRecommendations] =
    useState<OnboardingRecommendations | null>(null);

  const step = onboardingSteps[stepIndex];
  const picked = selection[step?.id ?? "contentTypes"] ?? [];
  const isOptional = step?.min === 0;
  const canContinue = isOptional || picked.length >= (step?.min ?? 1);
  const isLastStep = stepIndex === onboardingSteps.length - 1;
  const tintSeed = sectionTintSeed("onboarding-recommendations");

  function toggleOption(optionId: string) {
    if (!step) return;
    setSelection((current) => {
      const list = current[step.id];
      if (list.includes(optionId)) {
        return {
          ...current,
          [step.id]: list.filter((id) => id !== optionId),
        };
      }
      if (step.max === 1) {
        return { ...current, [step.id]: [optionId] };
      }
      if (step.max && list.length >= step.max) return current;
      return { ...current, [step.id]: [...list, optionId] };
    });
  }

  function handleContinue() {
    if (phase === "intro") {
      setPhase("quiz");
      return;
    }
    if (!canContinue) return;
    if (!isLastStep) {
      setStepIndex((i) => i + 1);
      return;
    }
    setPhase("building");
    setBuildingStep(0);
  }

  useEffect(() => {
    const saved = getOnboardingProfile();
    if (!saved) return;
    setIsRetake(true);
    setSelection(saved.selection);
    setPhase("quiz");
  }, []);

  useEffect(() => {
    if (phase !== "building") return;
    let cancelled = false;
    const started = Date.now();

    const stepInterval = window.setInterval(() => {
      setBuildingStep((i) => Math.min(i + 1, buildingSteps.length - 1));
    }, 420);

    buildOnboardingRecommendations(selection).then((result) => {
      const remaining = Math.max(0, 2200 - (Date.now() - started));
      window.setTimeout(() => {
        if (cancelled) return;
        setRecommendations(result);
        saveOnboardingProfile(selection, result);
        setPhase("results");
      }, remaining);
    });

    return () => {
      cancelled = true;
      window.clearInterval(stepInterval);
    };
  }, [phase, selection]);

  if (phase === "intro") {
    return (
      <div className="flex w-full max-w-[640px] flex-col items-center gap-8 text-center">
        <div className="relative flex size-24 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-gradient-brand opacity-30 blur-xl" />
          <Sparkles className="relative size-12 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white sm:text-title">
            {isRetake
              ? `Update your taste, ${userName}`
              : `Welcome to AniVerse, ${userName}`}
          </h1>
          <p className="mt-3 text-sm text-muted sm:text-subtitle">
            {isRetake
              ? "Retake the taste test to refresh your AI matches, music picks, and community recommendations."
              : "Answer a short taste test and we'll build your personalized universe — matched anime, music, communities, and collections before you even reach the dashboard."}
          </p>
        </div>
        <ul className="grid w-full grid-cols-2 gap-3 text-left sm:grid-cols-4">
          {[
            { emoji: "🎯", label: "AI Matches" },
            { emoji: "🎵", label: "Music Picks" },
            { emoji: "👥", label: "Communities" },
            { emoji: "📒", label: "Collections" },
          ].map((item) => (
            <li
              key={item.label}
              className="flex flex-col items-center gap-1 rounded-card border border-white/10 bg-glass-purple px-3 py-4"
            >
              <span className="text-xl" aria-hidden>
                {item.emoji}
              </span>
              <span className="text-xs font-semibold text-white">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
        <GradientButton
          size="md"
          className="w-full max-w-[320px] rounded-full"
          onClick={handleContinue}
        >
          Start {isRetake ? "Retake" : "Taste Test"}
          <ArrowRight className="ms-1.5 size-4" />
        </GradientButton>
        <Link
          href="/dashboard"
          className="text-xs text-muted transition-colors hover:text-brand-pink"
        >
          Skip for now — take me to the dashboard
        </Link>
      </div>
    );
  }

  if (phase === "building") {
    return (
      <div className="flex min-h-[60dvh] w-full max-w-[420px] flex-col items-center justify-center gap-6 text-center">
        <div className="relative flex size-28 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-brand-magenta/25" />
          <span className="absolute inset-2 animate-pulse rounded-full bg-gradient-brand opacity-60 blur-md" />
          <Sparkles className="relative size-12 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white sm:text-title">
            Building your universe…
          </h1>
          <p className="mt-2 text-sm text-muted sm:text-subtitle">
            {buildingSteps[buildingStep]}
          </p>
        </div>
        <div className="flex w-full flex-col gap-2">
          {buildingSteps.map((label, i) => (
            <div
              key={label}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5 text-left text-xs transition-colors",
                i <= buildingStep
                  ? "bg-glass-magenta text-white"
                  : "bg-white/5 text-muted/60",
              )}
            >
              {i < buildingStep ? (
                <Check className="size-3.5 shrink-0 text-brand-pink" />
              ) : (
                <span className="size-3.5 shrink-0 rounded-full border border-white/30" />
              )}
              {label}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (phase === "results" && recommendations) {
    return (
      <div className="flex w-full max-w-[1100px] flex-col items-center gap-8 pb-10">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2 text-sm font-bold text-white shadow-glow-pink-soft">
            <Sparkles className="size-4" />
            AI Taste Profile: {recommendations.tasteScore}% Match
          </span>
          <h1 className="mt-2 text-xl font-bold text-white sm:text-title">
            Your universe is ready, {userName}
          </h1>
          <p className="max-w-[520px] text-sm text-muted sm:text-subtitle">
            Here&apos;s your personalized AniVerse — content, music, artists,
            communities, and collections matched to your taste.
          </p>
        </div>

        {recommendations.summaryChips.length > 0 ? (
          <div className="flex w-full flex-wrap justify-center gap-2 px-2">
            {recommendations.summaryChips.map((chip) => (
              <Chip key={chip} variant="indigo" className="text-xs">
                {chip}
              </Chip>
            ))}
          </div>
        ) : null}

        <TasteBreakdownPanel items={recommendations.tasteBreakdown} />

        <GoalLinksRow links={recommendations.goalLinks} />

        <CardRow title="📋 Your Starter Watchlist">
          {recommendations.starterWatchlist.map((item) => (
            <div key={item.id} className="relative shrink-0">
              <PosterCard item={item} tintSeed={tintSeed} />
              <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-gradient-brand text-[10px] font-bold text-white shadow-glow-pink-soft">
                <Clapperboard className="size-3" />
              </span>
            </div>
          ))}
        </CardRow>

        <CardRow title="🎯 Matched To Your Taste">
          {recommendations.content.map((item) => (
            <PosterCard key={item.id} item={item} tintSeed={tintSeed} />
          ))}
        </CardRow>

        <CardRow title="🎵 Songs & OSTs For You">
          {recommendations.tracks.map((track) => (
            <MusicCard key={track.id} track={track} tintSeed={tintSeed} />
          ))}
        </CardRow>

        <CardRow title="🎤 Artists For You">
          {recommendations.artists.map((artist) => (
            <ArtistCard key={artist.id} item={artist} tintSeed={tintSeed} />
          ))}
        </CardRow>

        <CardRow title="📒 Collections To Explore">
          {recommendations.collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              className="w-[190px] shrink-0"
            />
          ))}
        </CardRow>

        <CardRow title="👥 Communities You'll Love">
          {recommendations.communities.map((community) => (
            <CommunityCard
              key={community.id}
              community={community}
              ctaMode="join"
              className="w-[190px] shrink-0"
            />
          ))}
        </CardRow>

        <GradientButton
          size="md"
          className="mt-2 w-full max-w-[320px] rounded-full"
          onClick={() => router.push("/dashboard")}
        >
          Enter Your Universe
          <ArrowRight className="ms-1.5 size-4" />
        </GradientButton>
      </div>
    );
  }

  if (!step) return null;

  const selectionHint =
    step.max != null && step.max > 1
      ? `${picked.length}/${step.max} selected`
      : step.max === 1 && picked.length === 1
        ? "1 selected"
        : isOptional
          ? "Optional — skip or pick"
          : null;

  return (
    <div className="flex w-full max-w-[760px] flex-col items-center gap-8">
      <div className="flex w-full max-w-[480px] flex-col items-center gap-2">
        <div className="flex w-full items-center gap-1.5">
          {onboardingSteps.map((s, i) => (
            <span
              key={s.id}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-500",
                i <= stepIndex ? "bg-gradient-brand" : "bg-white/15",
              )}
            />
          ))}
        </div>
        <p className="text-xs text-muted">
          Step {stepIndex + 1} of {onboardingSteps.length}
          {selectionHint ? ` · ${selectionHint}` : ""}
        </p>
      </div>

      <div className="text-center">
        <h1 className="text-xl font-bold text-white sm:text-title">
          {step.title}
        </h1>
        <p className="mt-2 text-sm text-muted sm:text-subtitle">
          {step.subtitle}
        </p>
      </div>

      <div
        className={cn(
          "grid w-full gap-3 sm:gap-4",
          step.options.length <= 5 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-4",
        )}
      >
        {step.options.map((option) => {
          const selected = picked.includes(option.id);
          const atMax =
            step.max != null &&
            step.max > 1 &&
            picked.length >= step.max &&
            !selected;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggleOption(option.id)}
              aria-pressed={selected}
              disabled={atMax}
              className={cn(
                "relative flex cursor-pointer flex-col items-center gap-1.5 rounded-card px-3 py-5 text-center transition-all duration-300",
                selected
                  ? "border border-brand-magenta bg-glass-magenta shadow-glow-pink-soft"
                  : "border border-white/10 bg-glass-purple hover:border-white/30 hover:shadow-glow-pink-soft",
                atMax && "cursor-not-allowed opacity-40",
              )}
            >
              {selected ? (
                <span className="absolute right-2.5 top-2.5 flex size-5 items-center justify-center rounded-full bg-gradient-brand">
                  <Check className="size-3 text-white" strokeWidth={3} />
                </span>
              ) : null}
              <span className="text-2xl" aria-hidden>
                {option.emoji}
              </span>
              <span className="text-sm font-semibold text-white">
                {option.label}
              </span>
              {option.hint ? (
                <span className="text-[11px] text-muted">{option.hint}</span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="flex w-full max-w-[420px] items-center gap-3">
        {stepIndex > 0 ? (
          <button
            type="button"
            onClick={() => setStepIndex((i) => i - 1)}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
        ) : null}
        <GradientButton
          size="md"
          disabled={!canContinue}
          onClick={handleContinue}
          className={cn("flex-1 rounded-full", !canContinue && "opacity-50")}
        >
          {isLastStep
            ? "Build My Universe"
            : isOptional && picked.length === 0
              ? "Skip"
              : "Continue"}
          <ArrowRight className="ms-1.5 size-4" />
        </GradientButton>
      </div>

      <Link
        href="/dashboard"
        className="text-xs text-muted transition-colors hover:text-brand-pink"
      >
        Skip for now — take me to the dashboard
      </Link>
    </div>
  );
}
