import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `next dev` otherwise appends a Next.js agent-rules block to CLAUDE.md on
  // every run. CLAUDE.md here is the product build brief and the source of
  // truth for the whole project — build tooling doesn't get to edit it.
  // Next 16 differs from older versions in ways agents guess wrong about;
  // the guides it points at live in node_modules/next/dist/docs/.
  agentRules: false,

  /**
   * The Booking Check moved to `/check` in Phase 7. Advisors have been
   * using `/` as the check since the beginning, so the root keeps
   * working rather than 404ing on a bookmark.
   *
   * TEMPORARY, and deliberately a 307 rather than a 308. Phase 8 gives
   * `/` a real homepage and removes this; a permanent redirect would
   * have taught every cache and crawler something we are about to
   * contradict.
   */
  async redirects() {
    return [{ source: "/", destination: "/check", permanent: false }];
  },
};

export default nextConfig;
