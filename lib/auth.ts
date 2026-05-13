import crypto from "crypto";

const DEFAULT_ADMIN_USERNAME = "director";
const DEFAULT_ADMIN_PASSWORD = "director";

export async function verifyAdminLogin(username: string, password: string) {
  return username === DEFAULT_ADMIN_USERNAME && password === DEFAULT_ADMIN_PASSWORD;
}

const ADMIN_SECRET = "some-secret-key"; // In production, use env var

export async function createAdminSession() {
  const payload = { admin: true, timestamp: Date.now() };
  const payloadStr = JSON.stringify(payload);
  const signature = crypto.createHmac("sha256", ADMIN_SECRET).update(payloadStr).digest("hex");
  const token = Buffer.from(payloadStr).toString("base64") + "." + signature;
  return token;
}

export async function verifyAdminSession(token?: string) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const payloadStr = Buffer.from(parts[0], "base64").toString();
  const signature = parts[1];
  const expectedSignature = crypto.createHmac("sha256", ADMIN_SECRET).update(payloadStr).digest("hex");
  if (signature !== expectedSignature) return false;
  const payload = JSON.parse(payloadStr);
  // Check if not expired, say 24 hours
  if (Date.now() - payload.timestamp > 24 * 60 * 60 * 1000) return false;
  return payload.admin === true;
}

export async function revokeAdminSession(token?: string) {
  // No storage, nothing to revoke
}

export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string,
) {
  // Since no storage, password change not supported in production
  return false;
}
