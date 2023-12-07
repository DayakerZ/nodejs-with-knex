import { Knex } from "knex";

export class PostService {
  constructor(private knex: Knex) {}

  async getPostById(postId: string) {
    return this.knex.select("*").from("posts").where({ id: postId }).first();
  }

  async createPost(title: string, content: string, userId: string) {
    const [post] = await this.knex
      .from("posts")
      .insert({ title, content, user_id: userId }, [
        "id",
        "title",
        "content",
        "user_id",
      ]);
    return post;
  }

  async deletePost(postId: string) {
    const deletedPost = await this.getPostById(postId);

    if (deletedPost) {
      await this.knex.from("posts").where({ id: postId }).del();
      return deletedPost;
    } else {
      return null;
    }
  }
}
