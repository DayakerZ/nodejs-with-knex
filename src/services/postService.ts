import { Knex } from "knex";
import { producePost } from "../producer";

export class PostService {
  constructor(private knex: Knex) {}

  async getAllPosts() {
    const posts = await this.knex.select("*").from("posts");
    return posts;
  }

  async getPostsByuserId(userId: string) {
    return this.knex.select("*").from("posts").where({ user_id: userId });
  }

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

    if (post) {
      producePost(post);
    }
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

  async updatePost(
    postId: string,
    title: string,
    content: string,
    user_id: string
  ) {
    const [updatedPost] = await this.knex
      .from("posts")
      .where({ id: postId })
      .update({ title, content, user_id })
      .returning("*");

    return updatedPost;
  }
}
