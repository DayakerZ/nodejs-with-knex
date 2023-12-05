import { Knex } from "knex";

export class Postservice {
  constructor(private knex: Knex) {}

  async getPostById(postId: string) {
    return this.knex.select("*").from("posts").where({ id: postId }).first();
  }

  async createPost(title: string, content: string, userId: string) {
    const [postId] = await this.knex("posts").insert(
      { title, content, user_id: userId },
      "id"
    );
    return this.getPostById(postId.id);
  }

  async deletePost(postId: string) {
    const deletedPost = await this.getPostById(postId);

    if (deletedPost) {
      await this.knex("posts").where({ id: postId }).del();
      return deletedPost;
    } else {
      return null;
    }
  }
}
