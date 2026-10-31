import { describe, expect, it } from "vitest";
import { readContactErrorMessage } from "@/lib/contact/read-error-message";

describe("readContactErrorMessage", () => {
  it("uses the API's error message when the body is JSON", async () => {
    const response = new Response(JSON.stringify({ error: "Name is required." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });

    expect(await readContactErrorMessage(response)).toBe("Name is required.");
  });

  it("falls back to a readable sentence for an empty 500", async () => {
    // What the live site returned: calling response.json() on this throws
    // "Unexpected end of JSON input", which the form displayed verbatim.
    const response = new Response(null, { status: 500 });

    expect(await readContactErrorMessage(response)).toBe(
      "Your message couldn't be sent.",
    );
  });

  it("falls back for an HTML error page", async () => {
    const response = new Response("<html>504 Gateway Timeout</html>", {
      status: 504,
      headers: { "Content-Type": "text/html" },
    });

    expect(await readContactErrorMessage(response)).toBe(
      "Your message couldn't be sent.",
    );
  });
});
