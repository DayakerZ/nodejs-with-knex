import { Request, Response } from "express";
import { UserService } from "../services/userService";
import db from "../config/db";

export class UserController {
  userService: UserService;
  constructor() {
    this.userService = new UserService(db);
    this.createUser = this.createUser.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  public async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const { username, email } = req.body;
      const newUser = await this.userService.createUser(username, email);
      res.json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const { username, email } = req.body;
      const updatedUser = await this.userService.updateUser(
        userId,
        username,
        email
      );

      if (updatedUser) {
        res.json(updatedUser);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
