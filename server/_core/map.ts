export type DistanceMatrixResult = {
  status: string;
  origin_addresses: string[];
  destination_addresses: string[];
  rows: Array<{
    elements: Array<{
      status: string;
      distance: { text: string; value: number };
      duration: { text: string; value: number };
    }>;
  }>;
};

export async function makeRequest<T>(
  path: string,
  params: Record<string, string | number>,
): Promise<T> {
  const apiBase = process.env.MANUS_API_URL?.replace(/\/+$/, "");
  const apiKey = process.env.MANUS_API_KEY;
  if (!apiBase || !apiKey) {
    throw new Error("The managed Maps service is not available in this server runtime.");
  }

  const relativePath = path.replace(/^\/+/, "");
  const url = new URL(`v1/maps/proxy/${relativePath}`, `${apiBase}/`);
  url.searchParams.set("key", apiKey);
  for (const [name, value] of Object.entries(params)) {
    url.searchParams.set(name, String(value));
  }

  const response = await fetch(url);
  const body = await response.text();
  let payload: unknown;
  try {
    payload = body ? JSON.parse(body) : {};
  } catch {
    throw new Error("The managed Maps service returned an invalid response.");
  }

  const errorMessage = (payload as { error?: { message?: string } })?.error?.message;
  if (!response.ok || errorMessage) {
    throw new Error(
      errorMessage || `The managed Maps request failed (${response.status}).`,
    );
  }
  return payload as T;
}
