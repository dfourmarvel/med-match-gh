/**
 * Stub for @vercel/analytics in Jest.
 *
 * The real package ships ESM that Jest cannot parse, and firing genuine
 * analytics from a test run would be wrong regardless — it would put synthetic
 * events into the same stream the product is judged by.
 */
export const track = jest.fn();
export const Analytics = () => null;
