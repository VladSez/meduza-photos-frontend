import { headers } from "next/headers";

export function getIpAddress() {
  const FALLBACK_IP_ADDRESS = "Anonymous";
  const forwardedFor = headers().get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS;
  }

  return headers().get("x-real-ip") ?? FALLBACK_IP_ADDRESS;
}
