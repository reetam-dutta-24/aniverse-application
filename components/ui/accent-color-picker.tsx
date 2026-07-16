"use client";

import type { AccentColor } from "@/lib/catalog-enums";
import { PROFILE_ACCENT_OPTIONS } from "@/lib/profile-theme";
import { cn } from "@/lib/utils";

interface AccentColorPickerProps {
  value: AccentColor;
  onChange: (value: AccentColor) => void;
  disabled?: boolean;
}

export function AccentColorPicker({
  value,
  onChange,
  disabled = false,
}: AccentColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {PROFILE_ACCENT_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          title={option.label}
          disabled={disabled}
          onClick={() => onChange(option.value)}
          className={cn(
            "size-8 rounded-full border-2 transition-transform hover:scale-110 disabled:opacity-40",
            value === option.value
              ? "border-white shadow-glow-pink-soft"
              : "border-transparent",
          )}
          style={{ backgroundColor: option.hex }}
        />
      ))}
    </div>
  );
}
