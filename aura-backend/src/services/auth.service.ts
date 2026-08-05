import bcrypt from "bcryptjs";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { RevokedToken } from "../entities/RevokedToken";
import { ApiError } from "../utils/ApiError";
import { signAccessToken } from "../utils/jwt";
import { logger } from "../config/logger";

const SALT_ROUNDS = 10;

function toPublicUser(user: User) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export const authService = {
  async register(input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const userRepo = AppDataSource.getRepository(User);

    const existing = await userRepo.findOneBy({ email: input.email });
    if (existing) {
      throw ApiError.conflict("An account with this email already exists");
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
    const user = userRepo.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      passwordHash,
    });
    await userRepo.save(user);

    logger.info("user registered", { userId: user.id });

    const { token } = signAccessToken(user.id, user.email);
    return { user: toPublicUser(user), token };
  },

  async login(input: { email: string; password: string }) {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ email: input.email });

    if (!user) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const { token } = signAccessToken(user.id, user.email);
    logger.info("user logged in", { userId: user.id });

    return { user: toPublicUser(user), token };
  },

  async logout(jti: string, expiresAt: Date) {
    const revokedRepo = AppDataSource.getRepository(RevokedToken);
    await revokedRepo.save(revokedRepo.create({ jti, expiresAt }));
  },

  async getById(userId: string) {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: userId });
    if (!user) throw ApiError.notFound("User not found");
    return toPublicUser(user);
  },
};
