"use client";

import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { Flame, Coffee, Guitar, Film, Sun, Moon } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const examples: {
  icon: LucideIcon;
  label: string;
  prompt: string;
  gradient: string;
  border: string;
  iconColor: string;
}[] = [
  {
    icon: Flame,
    label: "Hype track",
    prompt: "An aggressive trap beat with heavy 808s and a triumphant brass melody",
    gradient: "from-orange-500/20 to-red-500/20",
    border: "hover:border-orange-500/30",
    iconColor: "text-orange-400",
  },
  {
    icon: Coffee,
    label: "Lo-fi chill",
    prompt: "A chill lo-fi hip hop beat with jazzy piano chords and vinyl crackle",
    gradient: "from-pink-500/20 to-rose-500/20",
    border: "hover:border-pink-500/30",
    iconColor: "text-pink-400",
  },
  {
    icon: Guitar,
    label: "Rock anthem",
    prompt: "An energetic rock anthem with electric guitars, driving drums, and a big chorus",
    gradient: "from-purple-500/20 to-violet-500/20",
    border: "hover:border-purple-500/30",
    iconColor: "text-purple-400",
  },
  {
    icon: Film,
    label: "Cinematic score",
    prompt: "An epic cinematic orchestral piece with strings, horns, and building tension",
    gradient: "from-green-500/20 to-emerald-500/20",
    border: "hover:border-green-500/30",
    iconColor: "text-green-400",
  },
  {
    icon: Sun,
    label: "Summer vibes",
    prompt: "A tropical house track with steel drums, upbeat synths, and a catchy drop",
    gradient: "from-amber-500/20 to-yellow-500/20",
    border: "hover:border-amber-500/30",
    iconColor: "text-amber-400",
  },
  {
    icon: Moon,
    label: "Sleepy ambient",
    prompt: "A dreamy ambient track with soft pads, gentle rain sounds, and slow piano",
    gradient: "from-blue-500/20 to-indigo-500/20",
    border: "hover:border-blue-500/30",
    iconColor: "text-blue-400",
  },
];

const steps = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      </svg>
    ),
    title: "Type your idea",
    desc: "Describe the vibe, genre, or mood you want.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
    title: "AI generates it",
    desc: "We turn your description into a unique music track using AI.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    title: "Download & share",
    desc: "Get your track as a file and share it anywhere.",
  },
];

export default function Home() {
  const { isSignedIn } = useAuth();
  const clerk = useClerk();

  function handleCTA() {
    if (!isSignedIn) {
      clerk.openSignIn({ fallbackRedirectUrl: "/generate" });
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center px-4 pt-24 pb-20 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500" />
          </span>
          <span className="text-xs font-medium text-purple-300">AI-Powered Music Generation</span>
        </div>

        <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-white sm:text-7xl">
          Turn any idea into{" "}
          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent animate-gradient">
            music
          </span>
        </h1>
        <p className="mt-6 max-w-lg text-lg text-white/50 leading-relaxed">
          Lo-fi beats. Epic soundtracks. Chill vibes.
          Describe any mood, get a unique track in seconds.
        </p>
        <div className="mt-10 flex gap-4">
          <Link
            href="/generate"
            onClick={isSignedIn ? undefined : (e) => { e.preventDefault(); handleCTA(); }}
            className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white transition-all glow-btn hover:scale-[1.02] active:scale-[0.98]"
          >
            Start creating
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <a
            href="#use-cases"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white"
          >
            See examples
          </a>
        </div>
        <p className="mt-4 text-xs text-white/30">
          3 free generations &middot; No credit card needed
        </p>
      </section>

      {/* Waveform decoration */}
      <div className="flex items-center justify-center gap-[3px] py-4">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="w-[2px] rounded-full bg-gradient-to-t from-purple-500/40 to-violet-400/60"
            style={{
              height: 8,
              animation: `waveform ${1.8 + Math.sin(i * 0.4) * 0.8}s ease-in-out ${i * 0.1}s infinite`,
              opacity: 0.3 + Math.sin(i * 0.3) * 0.3,
            }}
          />
        ))}
      </div>

      {/* Use cases */}
      <section id="use-cases" className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              People use it for
            </h2>
            <p className="mt-2 text-sm text-white/40">Click any example to try it out</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {examples.map((ex) => (
              <Link
                key={ex.label}
                href={`/generate?prompt=${encodeURIComponent(ex.prompt)}`}
                className={`group glass glass-hover rounded-xl px-5 py-5 text-center transition-all duration-300 ${ex.border} hover:scale-[1.02] flex flex-col items-center`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${ex.gradient}`}>
                  <ex.icon className={`h-5 w-5 ${ex.iconColor}`} />
                </div>
                <span className="mt-3 block text-sm font-semibold text-white/90 group-hover:text-white">
                  {ex.label}
                </span>
                <span className="mt-1 block text-xs text-white/40 line-clamp-2 group-hover:text-white/60">
                  &ldquo;{ex.prompt}&rdquo;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">
            How it works
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {steps.map((item, i) => (
              <div key={i} className="group text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 text-purple-400 ring-1 ring-purple-500/20 transition-all group-hover:ring-purple-500/40 group-hover:scale-110">
                  {item.icon}
                </div>
                <div className="mt-1 text-xs font-mono text-white/20">0{i + 1}</div>
                <h3 className="mt-2 text-sm font-semibold text-white/90">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-white/40 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 py-20 text-center">
        <div className="mx-auto max-w-md glass rounded-2xl px-8 py-12 glow-purple">
          <h2 className="text-2xl font-bold text-white">
            Ready to try it?
          </h2>
          <p className="mt-3 text-sm text-white/40">
            Your first 3 generations are completely free.
          </p>
          <Link
            href="/generate"
            onClick={isSignedIn ? undefined : (e) => { e.preventDefault(); handleCTA(); }}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white transition-all glow-btn hover:scale-[1.02] active:scale-[0.98]"
          >
            Start creating for free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-4 py-6 text-center">
        <p className="text-xs text-white/20">
          audiotemka &middot; Made with AI
        </p>
      </footer>
    </div>
  );
}
