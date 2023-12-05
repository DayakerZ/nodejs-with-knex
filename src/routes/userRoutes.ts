import { Router} from "express";
import { UserController } from "../controllers/userController";

const userController = new UserController();

const router = Router();

router.post("/", userController.createUser);

router.get("/", userController.getAllUsers);

router.put("/:id", userController.updateUser);

export default router;
