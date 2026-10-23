import Reveal from "./Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export default function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <Reveal className="mb-12 max-w-2xl">
      <p className="font-mono text-sm font-medium tracking-widest text-accent uppercase">
        {eyebrow}
      </p>
      <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description ? <p className="mt-4 text-base leading-relaxed text-muted">{description}</p> : null}
    </Reveal>
  );
}
