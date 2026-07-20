// Answer-first lead passage — the self-contained, timestamped factual sentence
// AI search extracts and cites. Flat left-rule callout (no rounded, no card).
export function AnswerLead({ children }: { children: React.ReactNode }) {
  return (
    <p className="border-l-2 border-brand bg-surface px-5 py-4 text-base leading-relaxed text-foreground/85">
      {children}
    </p>
  );
}
