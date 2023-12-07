import { Knex } from "knex";

export class UserService {
  knex: Knex;
  constructor(knex: Knex) {
    this.knex = knex;
  }

  async getAllUsers() {
    return this.knex.select("*").from("users");
  }

  async createUser(username: string, email: string) {
    const [user] = await this.knex
      .from("users")
      .insert({ username, email }, ["id", "username", "email"]);
    return user;
  }

  async getUserById(userId: string) {
    return this.knex.select("*").from("users").where({ id: userId }).first();
  }

  async updateUser(userId: string, username: string, email: string) {
    const [updatedUser] = await this.knex
      .from("users")
      .where({ id: userId })
      .update({ username, email })
      .returning("*");

    return updatedUser || null;
  }
}
