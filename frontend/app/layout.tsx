import type { Metadata } from "next";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "audiotemka - AI Music Generator",
  description: "Turn any idea into music. Describe a vibe, get a track back in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="noise min-h-full flex flex-col bg-[#09090b]">
        <ClerkProvider appearance={{ baseTheme: dark }}>
          {/* Ambient background blobs */}
          <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-purple-600/20 blur-[128px]" />
            <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-500/15 blur-[128px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-[100px]" />
          </div>

          <header className="relative z-10 flex items-center justify-between border-b border-white/[0.06] px-6 py-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 transition-transform group-hover:scale-110">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-white/90 tracking-tight">
                audiotemka
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <Show when="signed-out">
                <SignInButton>
                  <button className="rounded-lg px-3 py-1.5 text-sm text-white/50 transition-colors hover:text-white/90">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="rounded-lg bg-gradient-to-r from-purple-500 to-violet-600 px-3.5 py-1.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-purple-500/25">
                    Sign up
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </header>

          <div className="relative z-10 flex flex-1 flex-col">
            {children}
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
