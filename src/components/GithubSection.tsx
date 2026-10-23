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
    <section id="github" className="scroll-mt-24 border-y border-border bg-surface/50 py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Open Source"
          title="GitHub & Developer Activity"
          description="Live data from my public GitHub profile — the code behind the projects above."
        />

        {state.status === "loading" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
            {featuredRepos.map((name) => (
              <div key={name} className="animate-pulse rounded-2xl border border-border bg-surface p-6">
                <div className="h-5 w-2/3 rounded bg-surface-2" />
                <div className="mt-4 h-4 w-full rounded bg-surface-2" />
                <div className="mt-2 h-4 w-5/6 rounded bg-surface-2" />
                <div className="mt-6 h-4 w-1/2 rounded bg-surface-2" />
              </div>
            ))}
          </div>
        ) : null}

        {state.status === "error" ? (
          <Reveal>
            <div className="rounded-2xl border border-border bg-surface p-8 text-center">
              <Github className="mx-auto h-10 w-10 text-muted" />
              <p className="mt-4 text-base text-muted">
                GitHub data couldn&apos;t be loaded right now (the public API may be rate-limited). You can browse
                everything directly on my profile instead.
              </p>
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
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
              <div className="mb-8 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl border border-border bg-surface px-6 py-5">
                <span className="inline-flex items-center gap-2 text-sm text-muted">
                  <Github className="h-5 w-5 text-foreground" />
                  <span className="font-semibold text-foreground">@{siteConfig.githubUsername}</span>
                </span>
                <span className="text-sm text-muted">
                  <span className="font-semibold text-foreground">{state.profile.public_repos}</span> public repositories
                </span>
                <span className="text-sm text-muted">
                  <span className="font-semibold text-foreground">{state.profile.followers}</span> followers
                </span>
                <a
                  href={state.profile.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                >
                  View profile
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {state.repos.map((repo, i) => (
                <Reveal key={repo.name} delay={i * 0.06} className="h-full">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-display text-base font-bold break-all text-foreground group-hover:text-accent">
                        {repo.name}
                      </span>
                      <ExternalLink className="h-4 w-4 shrink-0 text-muted" />
                    </span>
                    <span className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-muted">
                      {repo.description ?? FALLBACK_DESCRIPTIONS[repo.name] ?? "Public repository on GitHub."}
                    </span>
                    <span className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-5 font-mono text-xs text-muted">
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
