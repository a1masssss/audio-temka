"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:8000";

const genres = [
  { value: "", label: "Any genre" },
  { value: "Pop", label: "Pop" },
  { value: "Hip Hop", label: "Hip Hop" },
  { value: "R&B", label: "R&B" },
  { value: "Rock", label: "Rock" },
  { value: "Electronic", label: "Electronic" },
  { value: "Lo-fi", label: "Lo-fi" },
  { value: "Jazz", label: "Jazz" },
  { value: "Classical", label: "Classical" },
  { value: "Country", label: "Country" },
  { value: "Reggae", label: "Reggae" },
  { value: "Metal", label: "Metal" },
  { value: "Funk", label: "Funk" },
  { value: "Ambient", label: "Ambient" },
  { value: "Latin", label: "Latin" },
];

const suggestions = [
  "A chill lo-fi beat with soft piano and rain vibes",
  "An epic orchestral score like a movie trailer",
  "Upbeat funk track with slap bass and groovy drums",
];

export default function GeneratePage() {
  return (
    <Suspense>
      <GeneratePageInner />
    </Suspense>
  );
}

function GeneratePageInner() {
  const { getToken, isSignedIn } = useAuth();
  const clerk = useClerk();
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const p = searchParams.get("prompt");
    if (p) setPrompt(p);
  }, [searchParams]);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;

    if (!isSignedIn) {
      clerk.openSignIn({
        fallbackRedirectUrl: window.location.href,
      });
      return;
    }

    setLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const token = await getToken();
      if (!token) throw new Error("Could not retrieve session token.");

      const res = await fetch(`${API_BASE}/api/generate-audio/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt, genre }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || `Server error (${res.status})`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-start justify-center px-4 py-12 sm:py-20">
      <main className="w-full max-w-xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Generate Music
            </h1>
            <p className="mt-1 text-sm text-white/40">
              Describe the vibe, genre, or mood you want.
            </p>
          </div>
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>
        </div>

        {/* Genre picker */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-white/30 uppercase tracking-wider">
            Genre
          </p>
          <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => setGenre(g.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  genre === g.value
                    ? "bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/40"
                    : "border border-white/[0.06] bg-white/[0.03] text-white/40 hover:border-purple-500/20 hover:bg-purple-500/10 hover:text-purple-300"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="glass rounded-xl p-1 glow-purple transition-all ring-1 ring-purple-500/30 focus-within:ring-purple-500/60">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A dreamy synth-wave track with retro vibes and soft vocals..."
              rows={4}
              className="w-full resize-none rounded-lg bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none"
            />
            <div className="flex items-center justify-between px-3 pb-2">
              <span className="text-xs text-white/20">
                {prompt.length} chars
              </span>
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-violet-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-purple-500/25 disabled:cursor-not-allowed disabled:opacity-30 active:scale-[0.97]"
              >
                {loading ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    Generate
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Quick suggestions */}
        {!audioUrl && !loading && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-white/20 uppercase tracking-wider">
              Try these
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setPrompt(s)}
                  className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs text-white/40 transition-all hover:border-purple-500/20 hover:bg-purple-500/10 hover:text-purple-300"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-red-400"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="glass rounded-xl p-8 text-center">
            <div className="flex items-center justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full bg-purple-400"
                  style={{
                    height: 8,
                    animation: `waveform 0.8s ease-in-out ${i * 0.1}s infinite`,
                  }}
                />
              ))}
            </div>
            <p className="mt-4 text-sm text-white/40">
              Generating your track...
            </p>
            <p className="mt-1 text-xs text-white/20">
              This may take a few seconds
            </p>
          </div>
        )}

        {/* Audio result */}
        {audioUrl && (
          <div className="rounded-xl bg-gradient-to-br from-purple-500/15 to-violet-600/10 ring-1 ring-purple-500/20 glow-purple px-5 py-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-600">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-white">
                Your track is ready
              </p>
            </div>
              <audio
                ref={audioRef}
                controls
                src={audioUrl}
                className="w-full [&::-webkit-media-controls-panel]:bg-white/5"
              />
              <div className="flex gap-2">
                <a
                  href={audioUrl}
                  download="generated.wav"
                  className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-white/70 ring-1 ring-white/10 transition-all hover:bg-white/10 hover:text-white"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download
                </a>
                <button
                  onClick={() => {
                    setAudioUrl(null);
                    setPrompt("");
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-white/70 ring-1 ring-white/10 transition-all hover:bg-white/10 hover:text-white"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                  New generation
                </button>
              </div>
          </div>
        )}
      </main>
    </div>
  );
}
