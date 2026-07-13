import type { NextConfig } from "next";

// SEC-5: baseline security headers applied to every response. Kept intentionally
// minimal (no CSP yet) so they can't break Next inline styles or framer-motion;
// a Content-Security-Policy is a recommended follow-up that needs browser testing.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }
];

const nextConfig: NextConfig = {
  typedRoutes: true,
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
