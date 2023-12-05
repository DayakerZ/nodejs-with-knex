import { Router } from "express";
import db from "../config/db";
import { Postservice } from "../services/postService";
import { PostController } from "../controllers/postController";
import { UserService } from "../services/userService";

const postService = new Postservice(db);
const userService = new UserService(db);
const postController = new PostController(postService,userService);

const router = Router();

router.post("/", postController.createPost);

router.delete("/:id",postController.deletePost);

export default router;
