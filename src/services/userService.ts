import { Knex } from "knex";

export class UserService {
  constructor(private knex: Knex) {}

  async getAllUsers() {
    return this.knex.select("*").from("users");
  }

  async createUser(username: string, email: string) {
    const [userId] = await this.knex("users").insert({ username, email }, "id");
    return this.getUserById(userId.id);
  }

  async getUserById(userId: string) {
    return this.knex.select("*").from("users").where({ id: userId }).first();
  }

  async updateUser(userId: string, username: string, email: string) {
    const updatedCount = await this.knex("users")
      .where({ id: userId })
      .update({ username, email });

    if (updatedCount > 0) {
      return this.getUserById(userId);
    } else {
      return null;
    }
  }
}
