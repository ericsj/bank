import { jwtVerify, SignJWT } from "jose";
import type { Session } from "@/domain/types";

export const SESSION_DURATION_SECONDS = 60 * 60 * 8;
export const SESSION_COOKIE = "session";
const ALGORITHM = "HS256";

function validateAndEncodeSecret(secret = process.env.JWT_SECRET) {
  if (!secret || secret.length < 32) {
    throw new Error(
      "Missing JWT secret or JWT length is lower than 32 characters",
    );
  }
  return new TextEncoder().encode(secret);
}

export function signSessionToken(session: Session, secret?: string) {
  return new SignJWT({ accountId: session.accountId })
    .setProtectedHeader({ alg: ALGORITHM })
    .setSubject(session.userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(validateAndEncodeSecret(secret));
}

export async function verifySessionToken(
  token: string | undefined,
  secret?: string,
): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(
      token,
      validateAndEncodeSecret(secret),
      {
        algorithms: [ALGORITHM],
      },
    );
    if (typeof payload.sub !== "string") return null;
    if (typeof payload.accountId !== "string") return null;
    return { userId: payload.sub, accountId: payload.accountId };
  } catch {
    return null;
  }
}
