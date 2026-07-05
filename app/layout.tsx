import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/theme-provider";

const fontSans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"]
});

export const metadata: Metadata = {
  title: "MedMatch Ghana",
  description: "Discover medical and dental specialties that fit your personality, interests, and goals."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fontSans.variable} ${fontDisplay.variable}`}>
      <body className="overflow-x-hidden">
        <ThemeProvider>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <Navbar />
          <main
            id="main-content"
            className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
            tabIndex={-1}
          >
            {children}
          </main>
          <Footer />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
