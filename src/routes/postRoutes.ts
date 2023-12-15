import { Router } from "express";
import { PostController } from "../controllers/postController";
import { authenticateToken } from "../utils/authMiddleware";

const postController = new PostController();

const router = Router();

router.post("/", authenticateToken, postController.createPost);
router.delete("/:id", authenticateToken, postController.deletePost);
router.put("/:id", authenticateToken, postController.updatePost);


router.get("/", postController.getAllPosts);
router.get("/:userId", postController.getPostsByuserId);



export default router;
