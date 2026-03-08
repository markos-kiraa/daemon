"use client";

import Countdown from "./countdown";

interface LandingProps {
  birthDate: string;
}

export default function Landing({ birthDate }: LandingProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      {/* Title */}
      <h1
        className="landing-stagger-1 font-[family-name:var(--font-serif)] text-5xl sm:text-6xl md:text-7xl font-light tracking-[0.15em] uppercase"
        style={{ color: "var(--foreground)" }}
      >
        DAEMON
      </h1>

      {/* Tagline */}
      <p
        className="landing-stagger-2 font-[family-name:var(--font-serif)] text-base sm:text-lg md:text-xl font-light italic mt-6 mb-16"
        style={{ color: "var(--foreground-muted)" }}
      >
        A mind, waking up in public
      </p>

      {/* Countdown */}
      <div className="landing-stagger-3">
        <Countdown targetDate={birthDate} />
      </div>

      {/* Subtle bottom label */}
      <span
        className="landing-stagger-4 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.4em] uppercase mt-20"
        style={{ color: "var(--foreground-faint)" }}
      >
        genesis approaching
      </span>
    </div>
  );
}
