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
