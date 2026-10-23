"use client";

import { useEffect, useState } from "react";
import { ExternalLink, GitFork, Github, Star } from "lucide-react";
import { featuredRepos, siteConfig } from "@/data/content";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

interface GithubProfile {
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

interface GithubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  updated_at: string;
}

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; profile: GithubProfile; repos: GithubRepo[] };

const FALLBACK_DESCRIPTIONS: Record<string, string> = {
  New_Voice_model: "Open-source AI voice calling platform — FastAPI, WebSockets, Ollama, faster-whisper.",
  Atheleos_App: "Flutter app for the Atheleos sports social platform — Firebase, Firestore, Cloudflare R2.",
  Atheleos_Admin: "React + TypeScript admin panel for Atheleos — Express API, RBAC, moderation, analytics.",
  insta_Insights: "InsightBoard — Instagram Insights analytics app with official Meta OAuth (FastAPI + React).",
  CallingStream: "OpenOfficeVoice — self-hostable office calling portal (React, ASP.NET Core, Asterisk).",
  Nemi: "TinyGPT — a small transformer language model built from scratch in PyTorch.",
};

const CARD_ACCENTS = ["bg-pop-violet", "bg-pop-pink", "bg-pop-yellow", "bg-pop-mint", "bg-pop-sky", "bg-pop-violet"];

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", { year: "numeric", month: "short" });
  } catch {
    return "";
  }
}

export default function GithubSection() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const headers = { Accept: "application/vnd.github+json" };
        const profileRes = await fetch(`https://api.github.com/users/${siteConfig.githubUsername}`, { headers });
        if (!profileRes.ok) throw new Error("profile fetch failed");
        const profile = (await profileRes.json()) as GithubProfile;
        const repoResults = await Promise.all(
          featuredRepos.map(async (name) => {
            const res = await fetch(`https://api.github.com/repos/${siteConfig.githubUsername}/${name}`, { headers });
            if (!res.ok) return null;
            return (await res.json()) as GithubRepo;
          })
        );
        if (cancelled) return;
        setState({
          status: "ready",
          profile,
          repos: repoResults.filter((r): r is GithubRepo => r !== null),
        });
      } catch {
        if (!cancelled) setState({ status: "error" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="github" className="dots scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Open Source"
          title="Code On GitHub"
          description="Live data from my public GitHub profile — the code behind the projects above."
          accentClass="bg-pop-sky"
        />

        {state.status === "loading" ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
            {featuredRepos.map((name) => (
              <div key={name} className="pop animate-pulse rounded-3xl bg-paper p-6">
                <div className="h-5 w-2/3 rounded bg-ink/10" />
                <div className="mt-4 h-4 w-full rounded bg-ink/10" />
                <div className="mt-2 h-4 w-5/6 rounded bg-ink/10" />
                <div className="mt-6 h-4 w-1/2 rounded bg-ink/10" />
              </div>
            ))}
          </div>
        ) : null}

        {state.status === "error" ? (
          <Reveal>
            <div className="pop rounded-3xl bg-paper p-8 text-center">
              <Github className="mx-auto h-10 w-10 text-ink" />
              <p className="mx-auto mt-4 max-w-lg text-base font-medium text-ink/70">
                GitHub data couldn&apos;t be loaded right now (the public API may be rate-limited). You can browse
                everything directly on my profile instead.
              </p>
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noreferrer"
                className="pop-sm pop-hover pop-press font-label mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm tracking-[0.08em] text-cream uppercase"
              >
                <Github className="h-4 w-4" />
                github.com/Sahilssr1
              </a>
            </div>
          </Reveal>
        ) : null}

        {state.status === "ready" ? (
          <>
            <Reveal>
              <div className="pop mb-9 flex flex-wrap items-center gap-x-9 gap-y-3 rounded-3xl bg-paper px-6 py-5">
                <span className="inline-flex items-center gap-2.5 text-[15px] font-medium text-ink/70">
                  <span className="pop-sm flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-cream">
                    <Github className="h-5 w-5" />
                  </span>
                  <span className="font-bold text-ink">@{siteConfig.githubUsername}</span>
                </span>
                <span className="text-[15px] font-medium text-ink/70">
                  <span className="font-display text-xl text-ink">{state.profile.public_repos}</span> public
                  repositories
                </span>
                <span className="text-[15px] font-medium text-ink/70">
                  <span className="font-display text-xl text-ink">{state.profile.followers}</span> followers
                </span>
                <a
                  href={state.profile.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="pop-sm pop-hover pop-press font-label ml-auto inline-flex items-center gap-1.5 rounded-full bg-pop-yellow px-4 py-2 text-[13px] tracking-[0.08em] text-ink uppercase"
                >
                  View profile
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </Reveal>
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {state.repos.map((repo, i) => (
                <Reveal key={repo.name} delay={i * 0.06} className="h-full">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="pop group flex h-full flex-col rounded-3xl bg-paper p-6 transition-transform duration-200 hover:-translate-y-1.5 hover:rotate-[0.6deg]"
                  >
                    <span
                      className={`pop-sm mb-4 h-3.5 w-14 rounded-full ${CARD_ACCENTS[i % CARD_ACCENTS.length]}`}
                      aria-hidden="true"
                    />
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-base font-bold break-all text-ink group-hover:text-pop-violet">
                        {repo.name}
                      </span>
                      <ExternalLink className="h-4 w-4 shrink-0 text-ink/50" />
                    </span>
                    <span className="mt-2.5 line-clamp-3 text-sm leading-relaxed font-medium text-ink/70">
                      {repo.description ?? FALLBACK_DESCRIPTIONS[repo.name] ?? "Public repository on GitHub."}
                    </span>
                    <span className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-5 font-mono text-xs font-semibold text-ink/60">
                      {repo.language ? <span>{repo.language}</span> : null}
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3.5 w-3.5" /> {repo.stargazers_count}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <GitFork className="h-3.5 w-3.5" /> {repo.forks_count}
                      </span>
                      <span>Updated {formatDate(repo.updated_at)}</span>
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
