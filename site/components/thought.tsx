"use client";

import { useState, useEffect, useRef } from "react";
import type { ThoughtData } from "@/lib/types";

interface ThoughtProps extends Omit<ThoughtData, "id"> {
  isNew?: boolean;
}

function formatFullTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }) + " · " + date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatRelativeTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatFullTimestamp(iso);
}

function StreamingContent({
  content,
  speed,
}: {
  content: string;
  speed: number;
}) {
  const [wordCount, setWordCount] = useState(0);
  const [done, setDone] = useState(false);

  // Split into tokens: paragraph breaks stay as separate tokens, then words with their trailing space
  const tokens = useRef(
    content.split(/(\n\n)/).flatMap((segment) => {
      if (segment === "\n\n") return [segment];
      // Split segment into words, keeping trailing whitespace with each word
      return segment.match(/\S+\s*/g) || [];
    })
  ).current;

  useEffect(() => {
    setWordCount(0);
    setDone(false);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= tokens.length) {
        setWordCount(tokens.length);
        setDone(true);
        clearInterval(interval);
      } else {
        setWordCount(current);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [content, speed, tokens]);

  // Reconstruct revealed text from tokens
  const revealed = tokens.slice(0, wordCount).join("");
  const paragraphs = revealed.split("\n\n");

  return (
    <>
      {paragraphs.map((paragraph, i) => (
        <p key={i} className={i > 0 ? "mt-6" : ""}>
          {paragraph}
          {/* Show cursor at the end of the last paragraph */}
          {i === paragraphs.length - 1 && !done && (
            <span
              className="inline-block w-[2px] h-[1em] ml-[1px] align-baseline animate-pulse"
              style={{ background: "var(--foreground-muted)" }}
            />
          )}
        </p>
      ))}
    </>
  );
}

export default function Thought({
  content,
  type,
  era,
  createdAt,
  isNew,
}: ThoughtProps) {
  const isAphorism = type === "aphorism";
  const isReflection = type === "reflection";
  const [showRelative, setShowRelative] = useState(false);

  // Streaming speed: ms per word
  // Aphorisms: slower, more deliberate. Essays: faster flow.
  const streamSpeed = isAphorism ? 120 : 80;

  // Split content into paragraphs for essays
  const paragraphs = content.split("\n\n");

  return (
    <article
      className={`group py-10 md:py-14 ${isNew ? "animate-fade-in" : ""}`}
    >
      <div className="max-w-3xl mx-auto">
        {/* The thought itself */}
        <div
          className={`
            font-[family-name:var(--font-serif)] leading-relaxed tracking-wide
            ${isAphorism
              ? "text-2xl md:text-3xl font-light italic"
              : isReflection
              ? "text-lg md:text-xl font-normal italic pl-6 border-l"
              : "text-lg md:text-xl font-normal"
            }
          `}
          style={{
            color: "var(--foreground)",
            ...(isReflection && { borderColor: "var(--foreground-faint)" }),
          }}
        >
          {isNew ? (
            <StreamingContent content={content} speed={streamSpeed} />
          ) : (
            paragraphs.map((paragraph, i) => (
              <p key={i} className={i > 0 ? "mt-6" : ""}>
                {paragraph}
              </p>
            ))
          )}
        </div>

        {/* Metadata — date + time, with relative on hover */}
        <div
          className="mt-6 flex items-baseline gap-3 font-[family-name:var(--font-mono)] text-xs tracking-wider uppercase"
          style={{ color: "var(--foreground-muted)" }}
        >
          <time
            dateTime={createdAt}
            className="opacity-60 transition-opacity duration-500 group-hover:opacity-100 cursor-default"
            onMouseEnter={() => setShowRelative(true)}
            onMouseLeave={() => setShowRelative(false)}
          >
            {showRelative
              ? formatRelativeTimestamp(createdAt)
              : formatFullTimestamp(createdAt)
            }
          </time>

          {era && (
            <>
              <span className="opacity-20">·</span>
              <span className="opacity-30 transition-opacity duration-500 group-hover:opacity-70">
                {era}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Hairline rule */}
      <div
        className="mt-10 md:mt-14 h-px w-full"
        style={{ background: "var(--rule)" }}
      />
    </article>
  );
}
