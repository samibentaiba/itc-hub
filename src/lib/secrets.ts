
// src/lib/secrets.ts
import { prisma } from "./prisma";

const cache = new Map<string, { value: string; at: number }>();
const TTL_MS = 5 * 60 * 1000; // 5 minutes

async function getSecretRaw(key: string): Promise<string> {
  const now = Date.now();
  const cached = cache.get(key);
  if (cached && now - cached.at < TTL_MS) return cached.value;

  const rec = await prisma.appSecret.findUnique({ where: { key } });
  if (!rec) throw new Error(`Missing secret: ${key}`);

  cache.set(key, { value: rec.value, at: now });
  return rec.value;
}

export async function getEmailConfig() {
  const [host, portStr, secureStr, user, pass, from] = await Promise.all([
    getSecretRaw("EMAIL_HOST"),
    getSecretRaw("EMAIL_PORT"),
    getSecretRaw("EMAIL_SECURE"),
    getSecretRaw("EMAIL_USER"),
    getSecretRaw("EMAIL_PASSWORD"),
    getSecretRaw("EMAIL_FROM"),
  ]);

  const port = Number(portStr);
  const secure = secureStr === "true";

  if (!host || !port || user === "" || pass === "" || !from) {
    throw new Error("Email secrets are incomplete in AppSecret table.");
  }

  return { host, port, secure, user, pass, from };
}

export async function getAppBaseUrl(): Promise<string> {
  try {
    const url = await getSecretRaw("APP_BASE_URL");
    return url || "http://localhost:3000";
  } catch {
    return "http://localhost:3000";
  }
}
