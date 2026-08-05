import { Entity, PrimaryColumn, Column, CreateDateColumn } from "typeorm";

/**
 * JWTs are stateless, so "logout" is implemented by blacklisting the
 * token's jti (JWT ID) until it would have expired anyway. The auth
 * middleware checks incoming tokens against this table.
 *
 * A scheduled job (cron, pg_cron, etc.) should periodically delete rows
 * where expires_at < now() — not implemented here, noted in the README.
 */
@Entity({ name: "revoked_tokens" })
export class RevokedToken {
  @PrimaryColumn({ name: "jti", type: "uuid" })
  jti!: string;

  @Column({ name: "expires_at", type: "timestamptz" })
  expiresAt!: Date;

  @CreateDateColumn({ name: "revoked_at" })
  revokedAt!: Date;
}
