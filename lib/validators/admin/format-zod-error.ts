import type { ZodError } from "zod";

/** Human-readable message for the first validation issue (includes field path). */
export function formatZodError(error: ZodError): string {
  const issue = error.issues[0];
  if (!issue) return "Invalid input.";
  const path = issue.path.length > 0 ? issue.path.join(".") : null;
  const message = issue.message?.trim() || "Invalid value.";
  return path ? `${path}: ${message}` : message;
}

/** Summarize up to three validation issues for form error banners. */
export function formatZodErrors(error: ZodError, limit = 3): string {
  if (error.issues.length === 0) return "Invalid input.";
  return error.issues
    .slice(0, limit)
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "form";
      return `${path}: ${issue.message?.trim() || "Invalid value."}`;
    })
    .join(" · ");
}
