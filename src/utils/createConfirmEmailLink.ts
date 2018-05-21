import { v4 } from "uuid";
import { Redis } from "ioredis";

export const createConfirmEmailLink = async (
  url: string,
  userId: string,
  redis: Redis
) => {
  const id = v4();

  // Add to redis: Confirmation ID (token) -> with a user ID -> that expires in 24 hours. 
  await redis.set(id, userId, "ex", 60 * 60 * 24);
    return `${url}/confirm/${id}`;
};
