import { Briefcase, GraduationCap, MapPin, Sparkles } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const FACTS = [
  { icon: Briefcase, label: "Current role", value: "Full Stack Developer · Sanjivani Media and Technology" },
  { icon: Sparkles, label: "Experience", value: "Production web & mobile apps since August 2024" },
  { icon: GraduationCap, label: "Education", value: "MCA (pursuing) · B.Sc. Information Technology" },
  { icon: MapPin, label: "Based in", value: "Patna, India · Open to opportunities across India & remote" },
];

const INTERESTS = [
  "Full-stack engineering",
  "Application architecture",
  "API development",
  "Database design",
  "Practical software products",
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading eyebrow="About" title="About Me" />
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div className="space-y-5 text-base leading-relaxed text-muted">
              <p>
                I&apos;m a <span className="font-semibold text-foreground">software engineer and full-stack developer</span>{" "}
                at Sanjivani Media and Technology, where I build production web applications with C#, ASP.NET, and
                MySQL — from backend business logic and REST APIs to responsive, database-driven interfaces.
              </p>
              <p>
                My professional journey began in <span className="font-semibold text-foreground">August 2024</span> as a web
                development intern at the same company, and I moved into a full-time developer role in{" "}
                <span className="font-semibold text-foreground">March 2025</span>. Alongside my job, I build complete products of
                my own — a sports social platform, an HR system used by thousands, and an open-source AI voice
                calling platform.
              </p>
              <p>
                I&apos;m pursuing a <span className="font-semibold text-foreground">Master of Computer Applications</span> at Lovely
                Professional University (expected 2027), after completing a B.Sc. in Information Technology from
                Patliputra University in 2025.
              </p>
              <div className="pt-2">
                <p className="mb-3 text-sm font-semibold tracking-wide text-foreground uppercase">What I enjoy working on</p>
                <ul className="flex flex-wrap gap-2">
                  {INTERESTS.map((interest) => (
                    <li key={interest} className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-muted">
                      {interest}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <ul className="space-y-4">
              {FACTS.map((fact) => (
                <li key={fact.label} className="flex gap-4 rounded-2xl border border-border bg-surface p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <fact.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold tracking-widest text-muted uppercase">{fact.label}</span>
                    <span className="mt-1 block text-sm leading-relaxed font-medium text-foreground">{fact.value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
