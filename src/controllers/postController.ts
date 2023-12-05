import { Request, Response } from "express";
import { Postservice } from "../services/postService";
import { UserService } from "../services/userService";

export class PostController {
  constructor(
    private postService: Postservice,
    private userService: UserService
  ) {
    this.createPost = this.createPost.bind(this);
    this.deletePost = this.deletePost.bind(this);
  }

  async createPost(req: Request, res: Response) {
    try {
      const { title, content, userId } = req.body;
      const user = await this.userService.getUserById(userId);

      if (user) {
        const newPost = await this.postService.createPost(
          title,
          content,
          userId
        );
        res.json(newPost);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async deletePost(req: Request, res: Response) {
    try {
      const postId = req.params.id;
      const deletedPost = await this.postService.deletePost(postId);

      if (deletedPost) {
        res.json({ message: "Post deleted successfully" });
      } else {
        res.status(404).json({ error: "Post not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
