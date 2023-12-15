// Example login route
import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.SECRET_KEY || 'default-secret-key';

const router = Router();

router.post("/", (req: Request, res: Response) => {
  const { userId } = req.body;
  const token = jwt.sign({ userId }, secretKey, {
    expiresIn: "1h",
  });
  res.json({ token });
});

export default router;
