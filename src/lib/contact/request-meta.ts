import { createHash } from "crypto";

export function hashContactIp(ip: string, salt: string) {
  if (!ip.trim()) {
    return null;
  }

  return createHash("sha256").update(`${salt}:${ip.trim()}`).digest("hex");
}

export function getRequestIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "";
  }

  return request.headers.get("x-real-ip")?.trim() ?? "";
}
