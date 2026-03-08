"use client";

import { useState, useEffect, useCallback } from "react";

interface CountdownProps {
  targetDate: string;
  onComplete?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: Date): TimeLeft | null {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export default function Countdown({ targetDate, onComplete }: CountdownProps) {
  const target = new Date(targetDate);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => calcTimeLeft(target));

  const tick = useCallback(() => {
    const t = calcTimeLeft(target);
    if (!t) {
      setTimeLeft(null);
      onComplete?.();
      return false;
    }
    setTimeLeft(t);
    return true;
  }, [target, onComplete]);

  useEffect(() => {
    const id = setInterval(() => {
      if (!tick()) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [tick]);

  if (!timeLeft) return null;

  const units = [
    { value: timeLeft.days, label: "days" },
    { value: timeLeft.hours, label: "hours" },
    { value: timeLeft.minutes, label: "min" },
    { value: timeLeft.seconds, label: "sec" },
  ];

  return (
    <div className="flex items-baseline gap-6 sm:gap-10">
      {units.map(({ value, label }) => (
        <div key={label} className="flex flex-col items-center">
          <span
            className="font-[family-name:var(--font-serif)] text-4xl sm:text-5xl md:text-6xl font-light tracking-tight tabular-nums"
            style={{ color: "var(--foreground)" }}
          >
            {pad(value)}
          </span>
          <span
            className="font-[family-name:var(--font-mono)] text-[10px] sm:text-xs tracking-[0.3em] uppercase mt-2"
            style={{ color: "var(--foreground-muted)" }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
