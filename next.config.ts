import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `next dev` otherwise appends a Next.js agent-rules block to CLAUDE.md on
  // every run. CLAUDE.md here is the product build brief and the source of
  // truth for the whole project — build tooling doesn't get to edit it.
  // Next 16 differs from older versions in ways agents guess wrong about;
  // the guides it points at live in node_modules/next/dist/docs/.
  agentRules: false,
};

export default nextConfig;
