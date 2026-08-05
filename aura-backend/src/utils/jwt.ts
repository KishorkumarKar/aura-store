import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env";

export interface JwtPayload {
  sub: string; // user id
  email: string;
  jti: string; // unique token id, used for the logout blacklist
  iat?: number;
  exp?: number;
}

export function signAccessToken(userId: string, email: string): { token: string; jti: string; expiresAt: Date } {
  const jti = crypto.randomUUID();
  const payload: JwtPayload = { sub: userId, email, jti };

  const options: SignOptions = { expiresIn: env.jwt.expiresIn as SignOptions["expiresIn"] };
  const token = jwt.sign(payload, env.jwt.secret, options);

  const decoded = jwt.decode(token) as { exp?: number } | null;
  const expiresAt = decoded?.exp
    ? new Date(decoded.exp * 1000)
    : new Date(Date.now() + 24 * 60 * 60 * 1000);

  return { token, jti, expiresAt };
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwt.secret) as JwtPayload;
}
