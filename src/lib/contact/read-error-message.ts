const DEFAULT_MESSAGE = "Your message couldn't be sent.";

/**
 * Turns a failed /api/contact response into a sentence for the visitor.
 *
 * The API answers with `{ error }` JSON, but a crash, timeout or proxy error
 * can return an empty or HTML body. Calling `response.json()` on that throws
 * "Unexpected end of JSON input", which the form used to show verbatim.
 */
export async function readContactErrorMessage(response: Response): Promise<string> {
  let body = "";
  try {
    body = await response.text();
  } catch {
    return DEFAULT_MESSAGE;
  }

  try {
    const data = JSON.parse(body) as { error?: unknown };
    if (typeof data.error === "string" && data.error.trim()) {
      return data.error;
    }
  } catch {
    // Not JSON: fall through to the generic message.
  }

  return DEFAULT_MESSAGE;
}
