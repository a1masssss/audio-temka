import path from "path";
import { config as loadEnv } from "dotenv";
import type { NextConfig } from "next";

// Clerk keys live in ../backend/.env (single source of truth for this repo).
loadEnv({ path: path.resolve(process.cwd(), "../backend/.env") });

const nextConfig: NextConfig = {};

export default nextConfig;
