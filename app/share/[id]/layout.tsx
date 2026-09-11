import { notFound } from "next/navigation";
import { getResultById } from "@/lib/results";

/**
 * Decides whether the shared result exists, and 404s here rather than in the
 * page.
 *
 * The reason is `loading.tsx` in this segment: it wraps the PAGE in a Suspense
 * boundary, so Next flushes the response shell — headers and all — before the
 * page body resolves. A `notFound()` thrown from the page therefore rendered
 * the 404 UI over an HTTP 200, which is a soft 404: crawlers index a dead share
 * link as a real page and link checkers report it healthy.
 *
 * A layout renders OUTSIDE that boundary, so the status is still ours to set.
 * The skeleton keeps working for results that do exist, and getResultById is
 * wrapped in React's cache(), so the layout and page share one database read.
 */
export default async function SharedResultLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lookup = await getResultById(id);

  if (lookup.status !== "ok") {
    notFound();
  }

  return children;
}
