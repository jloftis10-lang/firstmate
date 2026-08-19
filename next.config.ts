import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `next dev` otherwise appends a Next.js agent-rules block to CLAUDE.md on
  // every run. CLAUDE.md here is the product build brief and the source of
  // truth for the whole project — build tooling doesn't get to edit it.
  // Next 16 differs from older versions in ways agents guess wrong about;
  // the guides it points at live in node_modules/next/dist/docs/.
  agentRules: false,

  /**
   * `/` was the Booking Check until Phase 7 and redirected to `/check`
   * until Phase 8 gave it a homepage. The redirect is gone rather than
   * inverted: both routes are real pages now and neither stands in for
   * the other. It was a 307 throughout, so nothing cached it as
   * permanent and no bookmark is stranded.
   */
};

export default nextConfig;
