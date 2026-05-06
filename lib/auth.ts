import crypto from "crypto";
import { readAdminData, writeAdminData } from "@/lib/data";

const DEFAULT_ADMIN_USERNAME = "director";
const DEFAULT_ADMIN_PASSWORD = "director";

function createHash(password: string, salt?: string) {
  const usedSalt = salt || crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, usedSalt, 64);
  return {
    hash: derivedKey.toString("hex"),
    salt: usedSalt,
  };
}

function compareHash(password: string, storedHash: string, salt: string) {
  const derivedKey = crypto.scryptSync(password, salt, 64);
  const storedBuffer = Buffer.from(storedHash, "hex");
  return (
    storedBuffer.length === derivedKey.length &&
    crypto.timingSafeEqual(storedBuffer, derivedKey)
  );
}

export async function ensureAdminCredentials() {
  const admin = await readAdminData();
  if (!admin.passwordHash || !admin.salt) {
    const defaultPair = createHash(DEFAULT_ADMIN_PASSWORD);
    admin.passwordHash = defaultPair.hash;
    admin.salt = defaultPair.salt;
    admin.sessions = [];
    await writeAdminData(admin);
  }
  return admin;
}

export async function verifyAdminLogin(username: string, password: string) {
  if (username !== DEFAULT_ADMIN_USERNAME) return false;
  const admin = await ensureAdminCredentials();
  return compareHash(password, admin.passwordHash, admin.salt);
}

export async function createAdminSession() {
  const admin = await ensureAdminCredentials();
  const token = crypto.randomBytes(32).toString("hex");
  const sessions = admin.sessions.filter(Boolean);
  sessions.push(token);
  admin.sessions = sessions;
  await writeAdminData(admin);
  return token;
}

export async function verifyAdminSession(token?: string) {
  if (!token) return false;
  const admin = await ensureAdminCredentials();
  return admin.sessions.includes(token);
}

export async function revokeAdminSession(token?: string) {
  if (!token) return;
  const admin = await ensureAdminCredentials();
  admin.sessions = admin.sessions.filter((session) => session !== token);
  await writeAdminData(admin);
}

export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string,
) {
  const admin = await ensureAdminCredentials();
  if (!compareHash(currentPassword, admin.passwordHash, admin.salt)) {
    return false;
  }
  const newPair = createHash(newPassword);
  admin.passwordHash = newPair.hash;
  admin.salt = newPair.salt;
  admin.sessions = [];
  await writeAdminData(admin);
  return true;
}
