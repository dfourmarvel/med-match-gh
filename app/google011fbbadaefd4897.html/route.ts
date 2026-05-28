export function GET() {
  return new Response("google-site-verification: google011fbbadaefd4897.html\n", {
    headers: {
      "Content-Type": "text/html; charset=utf-8"
    }
  });
}
