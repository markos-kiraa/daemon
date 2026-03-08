"use client";

interface BirthPulseProps {
  state: "thinking" | "speaking" | "idle";
}

export default function BirthPulse({ state }: BirthPulseProps) {
  if (state === "idle" || state === "speaking") return null;

  return (
    <div className="flex flex-col items-center gap-4 py-10 md:py-14">
      <div className="relative flex items-center justify-center">
        {/* Outer glow */}
        <div
          className="absolute rounded-full animate-breathe"
          style={{
            width: "60px",
            height: "60px",
            background: "radial-gradient(circle, rgba(232, 228, 223, 0.08) 0%, transparent 70%)",
          }}
        />

        {/* Inner core */}
        <div
          className="rounded-full animate-heartbeat"
          style={{
            width: "5px",
            height: "5px",
            background: "var(--foreground)",
          }}
        />
      </div>

      {/* Thinking indicator */}
      <span
        className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] uppercase animate-thinking"
        style={{ color: "var(--foreground-faint)" }}
      >
        thinking
      </span>
    </div>
  );
}
