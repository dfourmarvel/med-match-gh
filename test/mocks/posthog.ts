/**
 * Stub for posthog-js in Jest. Never loaded, so lib/analytics.ts no-ops and a
 * test run can't put synthetic events into the real product stream.
 */
const posthog = {
  __loaded: false,
  init: jest.fn(),
  capture: jest.fn(),
  identify: jest.fn(),
  reset: jest.fn(),
  get_distinct_id: jest.fn(() => "anonymous")
};

export default posthog;
