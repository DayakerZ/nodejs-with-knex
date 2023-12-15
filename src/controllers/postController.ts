import { Request, Response } from "express";
import { PostService } from "../services/postService";
import { UserService } from "../services/userService";
import db from "../config/db";

export class PostController {
  private postService: PostService;
  private userService: UserService;
  constructor() {
    this.postService = new PostService(db);
    this.userService = new UserService(db);
    this.createPost = this.createPost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.getAllPosts = this.getAllPosts.bind(this);
    this.getPostsByuserId = this.getPostsByuserId.bind(this);
    this.updatePost = this.updatePost.bind(this);
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

  async getAllPosts(req: Request, res: Response) {
    try {
      const posts = await this.postService.getAllPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getPostsByuserId(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const user = await this.userService.getUserById(userId);

      if (user) {
        const posts = await this.postService.getPostsByuserId(userId);
        res.json(posts);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.log("user not found in nternal server error");
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async updatePost(req: Request, res: Response) {
    try {
      const postId = req.params.id;
      const { title, content, userId } = req.body;

      const post = await this.postService.getPostById(postId);

     if (!post) {
       return res.status(404).json({ error: "Post not found" });
     }

     if (!userId || post.user_id !== userId) {
       return res
         .status(403)
         .json({ error: "Unauthorized to update this post" });
     }

     const updatedPost = await this.postService.updatePost(
       postId,
       title,
       content,
       userId
     );

     return res.json(updatedPost);

    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
