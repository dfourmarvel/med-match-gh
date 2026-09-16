import type { NextConfig } from "next";

// SEC-5: baseline security headers applied to every response.
// CSP allows 'unsafe-inline' for script-src because Next's inline bootstrap
// script has no nonce plumbing in this app; every other source is pinned to
// what the app actually loads (self, Vercel Speed Insights, Supabase).
// Next's dev bundler (React Fast Refresh) evaluates strings, so without
// 'unsafe-eval' in development the client never hydrates and every page hangs
// on its loading state. Production stays strict — this branch is dev-only.
const isDev = process.env.NODE_ENV === "development";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' https://*.supabase.co https://vitals.vercel-insights.com${isDev ? " ws://localhost:* http://localhost:*" : ""}`,
  // PostHog's session recorder compresses in a blob: web worker.
  "worker-src 'self' blob:",
  "frame-ancestors 'none'"
].join("; ");

// PostHog is reached through /ingest on this domain (see rewrites below).
const posthogRegion = process.env.NEXT_PUBLIC_POSTHOG_REGION === "us" ? "us" : "eu";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
  { key: "Content-Security-Policy", value: contentSecurityPolicy }
];

const nextConfig: NextConfig = {
  typedRoutes: true,
  // PostHog's API paths end in a slash; Next would otherwise redirect them.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: `https://${posthogRegion}-assets.i.posthog.com/static/:path*`
      },
      {
        source: "/ingest/:path*",
        destination: `https://${posthogRegion}.i.posthog.com/:path*`
      }
    ];
  },
  // PERF-2: tree-shake barrel imports from these icon/chart packages.
  // (framer-motion is already optimized by Next 15's defaults.)
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders
      }
    ];
  }
};

export default nextConfig;
