"use client";

interface ThoughtProps {
  content: string;
  type: "aphorism" | "essay" | "reflection";
  era?: string;
  createdAt: string;
}

function formatTimestamp(iso: string): string {
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

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Thought({
  content,
  type,
  era,
  createdAt,
}: ThoughtProps) {
  const isAphorism = type === "aphorism";

  return (
    <article className="group py-10 md:py-14">
      <div className="max-w-2xl mx-auto">
        {/* The thought itself */}
        <div
          className={`
            font-[family-name:var(--font-serif)] leading-relaxed tracking-wide
            ${isAphorism
              ? "text-2xl md:text-3xl font-light italic"
              : "text-lg md:text-xl font-light"
            }
          `}
          style={{ color: "var(--foreground)" }}
        >
          {content.split("\n\n").map((paragraph, i) => (
            <p key={i} className={i > 0 ? "mt-6" : ""}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Metadata — barely there */}
        <div
          className="mt-6 flex items-baseline gap-3 font-[family-name:var(--font-mono)] text-xs tracking-wider uppercase"
          style={{ color: "var(--foreground-muted)" }}
        >
          <time
            dateTime={createdAt}
            className="opacity-60 transition-opacity duration-500 group-hover:opacity-100"
          >
            {formatTimestamp(createdAt)}
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

      {/* Hairline rule — the only visual element */}
      <div
        className="mt-10 md:mt-14 h-px w-full"
        style={{ background: "var(--rule)" }}
      />
    </article>
  );
}
