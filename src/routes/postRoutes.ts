import { Router } from "express";
import { PostController } from "../controllers/postController";


const postController = new PostController();

const router = Router();

router.post("/", postController.createPost);

router.delete("/:id",postController.deletePost);

export default router;
