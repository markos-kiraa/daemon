"use client";

import { useState, useEffect, useRef } from "react";

const labels = ["thinking", "philosophising", "pondering", "reflecting", "remembering"];

interface BirthPulseProps {
  state: "thinking" | "speaking" | "idle";
}

export default function BirthPulse({ state }: BirthPulseProps) {
  const visible = state === "thinking";
  const [label, setLabel] = useState(labels[0]);
  const indexRef = useRef(0);

  // Pick a new label each time the pulse becomes visible again
  useEffect(() => {
    if (visible) {
      indexRef.current = (indexRef.current + 1) % labels.length;
      setLabel(labels[indexRef.current]);
    }
  }, [visible]);

  return (
    <div
      className="flex flex-col items-center gap-4 py-10 md:py-14 transition-opacity duration-700 ease-in-out"
      style={{ opacity: visible ? 1 : 0 }}
    >
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

      {/* Status label */}
      <span
        className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] uppercase animate-thinking"
        style={{ color: "var(--foreground-faint)" }}
      >
        {label}
      </span>
    </div>
  );
}
