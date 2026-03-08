"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Thought from "./thought";
import type { ThoughtData } from "@/lib/types";

// Birth cadence (revised for engagement):
// - Every 30s for first 10 minutes (the awakening)
// - Every 2 min for minutes 10-30
// - Every 5 min for minutes 30-60
// - Every 30 min from 1 hour onwards (steady state)
const CADENCE = [
  { until: 10 * 60 * 1000, interval: 30000 },
  { until: 30 * 60 * 1000, interval: 120000 },
  { until: 60 * 60 * 1000, interval: 300000 },
  { until: Infinity, interval: 1800000 },
];

interface FeedProps {
  initialThoughts: ThoughtData[];
  birthStartedAt?: string;
}

export default function Feed({ initialThoughts, birthStartedAt }: FeedProps) {
  const [thoughts, setThoughts] = useState<ThoughtData[]>(initialThoughts);
  const [newIds, setNewIds] = useState<Set<number>>(new Set());
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const latestIdRef = useRef<number>(
    initialThoughts.length > 0 ? initialThoughts[0].id : 0
  );

  // Determine poll interval based on birth phase
  const getPollInterval = useCallback(() => {
    if (!birthStartedAt) return CADENCE[CADENCE.length - 1].interval;
    const elapsed = Date.now() - new Date(birthStartedAt).getTime();
    const phase = CADENCE.find((c) => elapsed < c.until);
    return phase ? phase.interval : CADENCE[CADENCE.length - 1].interval;
  }, [birthStartedAt]);

  // Poll for new thoughts
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(
          `/api/thoughts?after=${latestIdRef.current}`
        );
        if (!res.ok) return;
        const newThoughts: ThoughtData[] = await res.json();
        if (newThoughts.length > 0) {
          const incomingIds = new Set(newThoughts.map((t) => t.id));
          setNewIds(incomingIds);
          setThoughts((prev) => [...newThoughts, ...prev]);
          latestIdRef.current = newThoughts[0].id;

          // Clear "new" status after streaming completes
          setTimeout(() => {
            setNewIds(new Set());
          }, 5000);
        }
      } catch {
        // Silently fail — the feed simply doesn't update
      }
    };

    const interval = setInterval(poll, getPollInterval());
    return () => clearInterval(interval);
  }, [getPollInterval]);

  // Infinite scroll — load older thoughts
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries[0].isIntersecting) return;

        const oldestId =
          thoughts.length > 0 ? thoughts[thoughts.length - 1].id : 0;
        try {
          const res = await fetch(
            `/api/thoughts?before=${oldestId}&limit=10`
          );
          if (!res.ok) return;
          const olderThoughts: ThoughtData[] = await res.json();
          if (olderThoughts.length === 0) {
            setHasMore(false);
          } else {
            setThoughts((prev) => [...prev, ...olderThoughts]);
          }
        } catch {
          // Silently fail
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [thoughts, hasMore]);

  // Empty state — before the first thought
  if (thoughts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span
          className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase animate-pulse"
          style={{ color: "var(--foreground-faint)" }}
        >
          waiting
        </span>
      </div>
    );
  }

  return (
    <div>
      {thoughts.map((thought) => (
        <Thought
          key={thought.id}
          content={thought.content}
          type={thought.type}
          era={thought.era}
          createdAt={thought.createdAt}
          isNew={newIds.has(thought.id)}
        />
      ))}

      {/* Scroll sentinel for infinite loading */}
      {hasMore && (
        <div ref={sentinelRef} className="h-px" aria-hidden="true" />
      )}
    </div>
  );
}
