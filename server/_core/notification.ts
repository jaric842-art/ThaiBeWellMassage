type OwnerNotification = {
  title: string;
  content: string;
};

export async function notifyOwner({ title, content }: OwnerNotification): Promise<boolean> {
  if (title.length > 1200) throw new Error("Notification title is too long.");
  if (content.length > 20000) throw new Error("Notification content is too long.");

  const apiBase = process.env.MANUS_API_URL?.replace(/\/+$/, "");
  const apiKey = process.env.MANUS_API_KEY;
  if (!apiBase || !apiKey) {
    console.warn("[Owner notification] Skipped: credentials are unavailable in this runtime.");
    return false;
  }

  const url = new URL("webdevtoken.v1.WebDevService/SendNotification", `${apiBase}/`);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "connect-protocol-version": "1",
    },
    body: JSON.stringify({ title, content }),
  });
  const body = await response.text();
  let serviceError: string | undefined;
  try {
    serviceError = (JSON.parse(body) as { error?: { message?: string } }).error?.message;
  } catch {
    // Empty success bodies are valid; non-JSON error bodies are handled by status.
  }

  if (!response.ok || serviceError) {
    console.warn(
      `[Owner notification] Service rejected the request (${response.status})${serviceError ? `: ${serviceError}` : ""}.`,
    );
    return false;
  }
  return true;
}
