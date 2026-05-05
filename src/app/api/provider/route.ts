import { getProviderInfo } from "@/lib/ai/provider";
import { isWebSearchAvailable } from "@/lib/search/provider";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    ...getProviderInfo(),
    webSearchAvailable: isWebSearchAvailable(),
  });
}
