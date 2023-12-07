import { Request, Response } from "express";
import { UserService } from "../../services/userService";
import { UserController } from "../../controllers/userController";

jest.mock("../../services/userService");

describe("UserController", () => {
  let userController: UserController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  beforeEach(() => {
    (UserService as jest.Mock).mockClear();
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  test("should call UserService constructor", () => {
    userController = new UserController();
    expect(UserService).toHaveBeenCalledTimes(1);
  });

  test("should return all users when getAllUsers method is called", async () => {
    expect(UserService).not.toHaveBeenCalled();

    userController = new UserController();
    expect(UserService).toHaveBeenCalledTimes(1);

    const mockUsers = [
      {
        id: "7cce27c5-9df8-4f8f-9b3f-24d314e5538a",
        username: "user1",
        email: "user1@example.com",
      },
    ];
    (UserService.prototype.getAllUsers as jest.Mock).mockResolvedValueOnce(
      mockUsers
    );

    await userController.getAllUsers(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
  });

  test("should handle errors and return 500 status", async () => {
    (UserService.prototype.getAllUsers as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    await userController.getAllUsers(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Internal Server Error",
    });
  });

  test("should create a new user", async () => {
    const mockUser = {
      id: "7cce27c5-9df8-4f8f-9b3f-24d314e5538a",
      username: "newuser",
      email: "newuser@example.com",
    };
    (UserService.prototype.createUser as jest.Mock).mockResolvedValueOnce(
      mockUser
    );
    mockRequest.body = { username: "newuser", email: "newuser@example.com" };

    await userController.createUser(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
  });

  test("should handle errors and return 500 status", async () => {
    (UserService.prototype.createUser as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );
    mockRequest.body = { username: "newuser", email: "newuser@example.com" };

    await userController.createUser(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Internal Server Error",
    });
  });

  test("should update an existing user", async () => {
    const mockUser = {
      id: "7cce27c5-9df8-4f8f-9b3f-24d314e5538a",
      username: "updateduser",
      email: "updateduser@example.com",
    };
    (UserService.prototype.updateUser as jest.Mock).mockResolvedValueOnce(
      mockUser
    );
    mockRequest.params = { id: "7cce27c5-9df8-4f8f-9b3f-24d314e5538a" };
    mockRequest.body = {
      username: "updateduser",
      email: "updateduser@example.com",
    };

    await userController.updateUser(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
  });

  test("should handle user not found and return 404 status", async () => {
    (UserService.prototype.updateUser as jest.Mock).mockResolvedValueOnce(null);
    mockRequest.params = { id: "999" };
    mockRequest.body = {
      username: "updateduser",
      email: "updateduser@example.com",
    };

    await userController.updateUser(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "User not found" });
  });

  test("should handle errors and return 500 status", async () => {
    (UserService.prototype.updateUser as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );
    mockRequest.params = { id: "7cce27c5-9df8-4f8f-9b3f-24d314e5538a" };
    mockRequest.body = {
      username: "updateduser",
      email: "updateduser@example.com",
    };

    await userController.updateUser(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Internal Server Error",
    });
  });
});
