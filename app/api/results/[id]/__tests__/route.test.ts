/**
 * @jest-environment node
 */

import { GET } from "@/app/api/results/[id]/route";
import { getResultById } from "@/lib/results";

jest.mock("@/lib/results", () => ({ getResultById: jest.fn() }));
const mockedGetResultById = jest.mocked(getResultById);

const VALID_ID = "11111111-1111-4111-8111-111111111111";

function get(id: string) {
  return GET(new Request(`http://localhost/api/results/${id}`), {
    params: Promise.resolve({ id })
  });
}

describe("GET /api/results/[id]", () => {
  it("returns 200 with the result on a hit", async () => {
    mockedGetResultById.mockResolvedValue({
      status: "ok",
      result: { audience: "medical-student" } as never
    });

    const response = await get(VALID_ID);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true, data: { audience: "medical-student" } });
  });

  it("returns 400 for an invalid id", async () => {
    mockedGetResultById.mockResolvedValue({ status: "invalid-id" });

    const response = await get("not-a-uuid");
    expect(response.status).toBe(400);
  });

  it("returns 404 when the result is not found", async () => {
    mockedGetResultById.mockResolvedValue({ status: "not-found" });

    const response = await get(VALID_ID);
    expect(response.status).toBe(404);
  });
});
