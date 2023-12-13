import { Knex } from "knex";
import redis from "../config/redis";
export class UserService {
  knex: Knex;
  constructor(knex: Knex) {
    this.knex = knex;
  }

  async getAllUsers() {
    const cacheKey = "allUsers";
    const cachedUsers = await redis.get(cacheKey);

    if (cachedUsers) {
      return JSON.parse(cachedUsers);
    } else {
      const users = await this.knex.select("*").from("users");
      await redis.set(cacheKey, JSON.stringify(users),'EX',15);
      return users;
    }
  }

  async createUser(username: string, email: string) {
    const [user] = await this.knex
      .from("users")
      .insert({ username, email }, ["id", "username", "email"]);
    return user;
  }

  async getUserById(userId: string) {
    const cacheKey = `user:${userId}`;
    const cachedUser = await redis.get(cacheKey);

    if (cachedUser) {
      return JSON.parse(cachedUser);
    } else {
      const user = await this.knex
        .select("*")
        .from("users")
        .where({ id: userId })
        .first();

      await redis.set(cacheKey, JSON.stringify(user), "EX", 10);
      return user;
    }
  }
  async updateUser(userId: string, username: string, email: string) {
    const [updatedUser] = await this.knex
      .from("users")
      .where({ id: userId })
      .update({ username, email })
      .returning("*");

    if (updatedUser) {
      await redis.del(`user:${userId}`);
      await redis.del("allUsers");
      return updatedUser;
    }

    return null;
  }
}
