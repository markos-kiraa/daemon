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

// Returns extra delay (ms) after a token based on punctuation
function punctuationDelay(token: string): number {
  const trimmed = token.trimEnd();
  if (/[.!?]$/.test(trimmed)) return 80;
  if (/[—;:]$/.test(trimmed)) return 50;
  if (/[,]$/.test(trimmed)) return 30;
  return 0;
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

  // Split into tokens: paragraph breaks as separate tokens, then individual characters
  const tokens = useRef(
    content.split(/(\n\n)/).flatMap((segment) => {
      if (segment === "\n\n") return [segment];
      return segment.split("");
    })
  ).current;

  useEffect(() => {
    setWordCount(0);
    setDone(false);

    let current = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    function tick() {
      current++;
      if (current >= tokens.length) {
        setWordCount(tokens.length);
        setDone(true);
        return;
      }
      setWordCount(current);

      // Calculate delay for next word
      const token = tokens[current];
      let delay = speed;

      if (token === "\n\n") {
        delay = 200; // paragraph break pause
      } else {
        delay += punctuationDelay(token);
      }

      timeoutId = setTimeout(tick, delay);
    }

    // Start first word
    timeoutId = setTimeout(tick, speed);

    return () => clearTimeout(timeoutId);
  }, [content, speed, tokens]);

  // Build revealed paragraphs with per-word spans for fade-in
  const revealedTokens = tokens.slice(0, wordCount);

  // Group tokens into paragraphs
  const paragraphs: string[][] = [[]];
  for (const token of revealedTokens) {
    if (token === "\n\n") {
      paragraphs.push([]);
    } else {
      paragraphs[paragraphs.length - 1].push(token);
    }
  }

  return (
    <>
      {paragraphs.map((words, i) => (
        <p key={i} className={i > 0 ? "mt-6" : ""}>
          {words.map((word, j) => (
            <span
              key={`${i}-${j}`}
              className="streaming-word"
            >
              {word}
            </span>
          ))}
          {/* Pulse dot at end of streaming text */}
          {i === paragraphs.length - 1 && !done && (
            <span
              className="inline-block w-[5px] h-[5px] rounded-full ml-[6px] align-middle animate-heartbeat"
              style={{ background: "var(--foreground)" }}
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

  // Streaming speed: ms per character (base delay, punctuation adds more)
  // Aphorisms: slower, more deliberate. Essays: measured flow.
  const streamSpeed = isAphorism ? 35 : 20;

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
