"use client";

// global-error replaces the root layout when the layout itself throws, so it
// must render its own <html>/<body> and cannot rely on the app's CSS/fonts.
// Styles are inlined to stay self-contained and on-brand (cream/forest palette).
export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          background: "#f7f2e7",
          color: "#14231c"
        }}
      >
        <div style={{ maxWidth: "480px", textAlign: "center" }}>
          <p
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontSize: "12px",
              fontWeight: 600,
              color: "#b45309"
            }}
          >
            Application error
          </p>
          <h1 style={{ fontSize: "28px", fontWeight: 600, margin: "12px 0" }}>MedMatch Ghana hit a problem</h1>
          <p style={{ fontSize: "14px", lineHeight: 1.7, color: "#3f4a44" }}>
            A critical error occurred while loading the app. Please try again{error?.digest ? ` (ref ${error.digest})` : ""}.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "20px",
              background: "#12291f",
              color: "#f6f0e2",
              border: "none",
              borderRadius: "10px",
              padding: "12px 20px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
