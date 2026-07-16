/** Client-side Socket.IO base URL — defaults to same origin in dev. */
export function getSocketUrl(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";
}
