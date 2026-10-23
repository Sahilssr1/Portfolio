const ITEMS = [
  "ASP.NET",
  "React",
  "TypeScript",
  "Flutter",
  "FastAPI",
  "MySQL",
  "PostgreSQL",
  "Firebase",
  "Docker",
  "REST APIs",
  "Next.js",
  "Tailwind CSS",
  "Cloudflare",
  "Node.js",
  "WebSockets",
  "Git & GitHub",
];

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center">
          <span className="font-display px-6 text-lg font-semibold tracking-wide whitespace-nowrap text-muted transition-colors hover:text-accent sm:text-xl">
            {item}
          </span>
          <span className="h-1.5 w-1.5 rotate-45 bg-accent/60" aria-hidden="true" />
        </span>
      ))}
    </div>
  );
}

/** Infinite technology marquee — decorative duplicate of the skills listed below. */
export default function TechMarquee() {
  return (
    <div className="marquee-mask overflow-hidden border-y border-border bg-surface/40 py-5" aria-label="Technologies I work with">
      <div className="animate-marquee flex w-max">
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
