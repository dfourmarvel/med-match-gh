import { getResultById } from "@/lib/results";
import { apiError, apiSuccess } from "@/lib/apiError";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lookup = await getResultById(id);

  if (lookup.status === "invalid-id") {
    return apiError("Invalid result id.", 400);
  }

  if (lookup.status === "not-found") {
    return apiError("Result not found.", 404);
  }

  return apiSuccess(lookup.result);
}
