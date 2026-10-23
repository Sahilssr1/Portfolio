import { Briefcase, GraduationCap, MapPin, Sparkles } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const FACTS = [
  { icon: Briefcase, label: "Current role", value: "Full Stack Developer · Sanjivani Media and Technology", chip: "bg-pop-pink" },
  { icon: Sparkles, label: "Experience", value: "Production web & mobile apps since August 2024", chip: "bg-pop-yellow" },
  { icon: GraduationCap, label: "Education", value: "MCA (pursuing) · B.Sc. Information Technology", chip: "bg-pop-mint" },
  { icon: MapPin, label: "Based in", value: "Patna, India · Open to opportunities across India & remote", chip: "bg-pop-sky" },
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
    <section id="about" className="dots-light scroll-mt-24 bg-pop-violet py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="About"
          title="About Me"
          accentClass="bg-pop-yellow"
          shadowClass="pop-sm"
          tone="cream"
        />
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div className="space-y-5 text-base leading-relaxed font-medium text-cream/90">
              <p>
                I&apos;m a{" "}
                <span className="pop-sm inline-block -rotate-1 bg-pop-yellow px-2 py-0.5 font-bold text-ink">
                  software engineer and full-stack developer
                </span>{" "}
                at Sanjivani Media and Technology, where I build production web applications with C#, ASP.NET, and
                MySQL — from backend business logic and REST APIs to responsive, database-driven interfaces.
              </p>
              <p>
                My professional journey began in <span className="font-bold text-cream">August 2024</span> as a web
                development intern at the same company, and I moved into a full-time developer role in{" "}
                <span className="font-bold text-cream">March 2025</span>. Alongside my job, I build complete products of
                my own — a sports social platform, an HR system used by thousands, and an open-source AI voice
                calling platform.
              </p>
              <p>
                I&apos;m pursuing a <span className="font-bold text-cream">Master of Computer Applications</span> at Lovely
                Professional University (expected 2027), after completing a B.Sc. in Information Technology from
                Patliputra University in 2025.
              </p>
              <div className="pt-2">
                <p className="font-label mb-3 text-sm tracking-[0.16em] text-cream uppercase">
                  ★ What I enjoy working on
                </p>
                <ul className="flex flex-wrap gap-2.5">
                  {INTERESTS.map((interest) => (
                    <li
                      key={interest}
                      className="pop-sm cursor-default rounded-full bg-cream px-3.5 py-1.5 text-sm font-semibold text-ink transition-transform hover:-rotate-2"
                    >
                      {interest}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <ul className="space-y-5">
              {FACTS.map((fact, i) => (
                <li
                  key={fact.label}
                  className={`pop flex gap-4 rounded-3xl bg-cream p-5 ${i % 2 === 0 ? "-rotate-[0.6deg]" : "rotate-[0.6deg]"}`}
                >
                  <span
                    className={`pop-sm flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-ink ${fact.chip}`}
                  >
                    <fact.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="font-label block text-xs tracking-[0.16em] text-ink/55 uppercase">{fact.label}</span>
                    <span className="mt-1 block text-sm leading-relaxed font-bold text-ink">{fact.value}</span>
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
