import { Request, Response } from "express";
import { UserService } from "../../services/userService";
import { PostService } from "../../services/postService";
import { PostController } from "../../controllers/postController";
import Redis from "ioredis";

jest.mock("ioredis");
jest.mock("../../services/userService");
jest.mock("../../services/postService");

describe("PostController", () => {
  let postController: PostController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  beforeEach(() => {
    (UserService as jest.Mock).mockClear();
    (PostService as jest.Mock).mockClear();
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  test("should call UserService and PostService constructor", () => {
    postController = new PostController();
    expect(UserService).toHaveBeenCalledTimes(1);
    expect(PostService).toHaveBeenCalledTimes(1);
  });

  test("should create a new post for a specified user ", async () => {
    const mockPost = {
      id: "7cce27c5-9df8-4f8f-9b3f-24d314e5538a",
      title: "post one",
      content: "content of post one",
      user_id: "acce27c5-9df8-4f8f-9b3f-24d314e5538a",
    };
    const mockUser = {
      id: "7cce27c5-9df8-4f8f-9b3f-24d314e5538a",
      username: "newuser",
      email: "newuser@example.com",
    };
    (UserService.prototype.getUserById as jest.Mock).mockResolvedValueOnce(
      mockUser
    );
    (PostService.prototype.createPost as jest.Mock).mockResolvedValueOnce(
      mockPost
    );

    mockRequest.body = {
      title: "post one",
      content: "content of post one",
      user_id: "acce27c5-9df8-4f8f-9b3f-24d314e5538a",
    };

    await postController.createPost(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockResponse.json).toHaveBeenCalledWith(mockPost);
  });

  test("should handle user not found and return 404 status while creating a post", async () => {
    (UserService.prototype.getUserById as jest.Mock).mockResolvedValueOnce(
      null
    );

    mockRequest.body = {
      title: "post one",
      content: "content of post one",
      user_id: "acce27c5-9df8-4f8f-9b3f-24d314e5538a",
    };

    await postController.createPost(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "User not found",
    });
  });

  test("should handle errors and return 500 status", async () => {
    (UserService.prototype.getUserById as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    mockRequest.body = {
      title: "post one",
      content: "content of post one",
      user_id: "acce27c5-9df8-4f8f-9b3f-24d314e5538a",
    };

    await postController.createPost(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Internal Server Error",
    });
  });

  test("should delete an existing post", async () => {
    const mockPost = {
      id: "7cce27c5-9df8-4f8f-9b3f-24d314e5538a",
      title: "post one",
      content: "content of post one",
      user_id: "acce27c5-9df8-4f8f-9b3f-24d314e5538a",
    };
    (PostService.prototype.deletePost as jest.Mock).mockResolvedValueOnce(
      mockPost
    );
    mockRequest.params = { id: "7cce27c5-9df8-4f8f-9b3f-24d314e5538a" };

    await postController.deletePost(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Post deleted successfully",
    });
  });

  test("should handle post not found and return 404 status while deleting a post", async () => {
    (PostService.prototype.deletePost as jest.Mock).mockResolvedValueOnce(null);

    mockRequest.params = { id: "7cce27c5-9df8-4f8f-9b3f-24d314e5538a" };

    await postController.deletePost(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Post not found",
    });
  });

  test("should handle errors and return 500 status", async () => {
    (PostService.prototype.deletePost as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    mockRequest.params = { id: "7cce27c5-9df8-4f8f-9b3f-24d314e5538a" };

    await postController.deletePost(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Internal Server Error",
    });
  });
});
