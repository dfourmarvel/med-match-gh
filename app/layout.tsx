import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "MedMatch Ghana",
  description: "Discover medical and dental specialties that fit your personality, interests, and goals."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6 lg:px-8">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
