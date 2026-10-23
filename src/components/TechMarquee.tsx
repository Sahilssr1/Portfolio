const ITEMS = ["WEB", "MOBILE", "AI", "APIS", "DATABASES", "CLOUD", "OPEN SOURCE"];
const STAR_COLORS = ["text-pop-yellow", "text-pop-pink", "text-pop-violet", "text-pop-mint"];

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {ITEMS.map((item, i) => (
        <span key={item} className="flex items-center">
          <span className="font-display px-6 text-2xl whitespace-nowrap text-cream uppercase sm:text-3xl">
            {item}
          </span>
          <span className={`text-2xl ${STAR_COLORS[i % STAR_COLORS.length]}`} aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

/** Tilted black marquee strip — the reference's signature band. */
export default function TechMarquee() {
  return (
    <div className="relative z-10 -my-2 overflow-hidden" aria-label="What I build: web, mobile, AI, APIs, databases, cloud">
      <div className="-mx-4 -rotate-[1.3deg] border-y-[3px] border-ink bg-ink py-3.5">
        <div className="animate-marquee flex w-max">
          <Row />
          <Row hidden />
          <Row hidden />
          <Row hidden />
        </div>
      </div>
    </div>
  );
}
