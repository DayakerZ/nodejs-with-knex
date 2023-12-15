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
    postController = new PostController();
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
    postController = new PostController();
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

  test("should handle errors and return 500 status while creating a post", async () => {
    postController = new PostController();
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
    postController = new PostController();
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
    postController = new PostController();
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

  test("should handle errors and return 500 status while deleting the post", async () => {
    postController = new PostController();
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

  test("should return all posts of the users ", async () => {
    postController = new PostController();
    const mockposts = [
      {
        id: "7cce27c5-9df8-4f8f-9b3f-24d314e5538a",
        title: "post one",
        content: "content of post one",
        user_id: "acce27c5-9df8-4f8f-9b3f-24d314e5538a",
      },
    ];
    (PostService.prototype.getAllPosts as jest.Mock).mockResolvedValueOnce(
      mockposts
    );

    await postController.getAllPosts(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockResponse.json).toHaveBeenCalledWith(mockposts);
  });

  test("should handle errors and return 500 status while getting all posts", async () => {
    postController = new PostController();
    (PostService.prototype.getAllPosts as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    await postController.getAllPosts(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Internal Server Error",
    });
  });

  test("should get all posts based on the user id provided", async () => {
    const userId = "acce27c5-9df8-4f8f-9b3f-24d314e5538a";
    const mockUser = {
      id: userId,
      username: "testuser",
      email: "test@example.com",
    };
    const mockposts = [
      {
        id: "3cce27c5-9df8-4f8f-9b3f-24d314e5538a",
        title: "post one",
        content: "content of post one",
        user_id: "acce27c5-9df8-4f8f-9b3f-24d314e5538a",
      },
    ];
    postController = new PostController();
    mockRequest.params = { userId: userId };

    (UserService.prototype.getUserById as jest.Mock).mockResolvedValueOnce(
      mockUser
    );

    (PostService.prototype.getPostsByuserId as jest.Mock).mockResolvedValueOnce(
      mockposts
    );

    await postController.getPostsByuserId(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockResponse.json).toHaveBeenCalledWith(mockposts);
  });

  test("should handle user not found and return 404 status while getting all posts of an user", async () => {
    const userId = "acce27c5-9df8-4f8f-9b3f-24d314e5538a";
    postController = new PostController();
    mockRequest.params = { userId: userId };

    (UserService.prototype.getUserById as jest.Mock).mockResolvedValueOnce(
      null
    );

    await postController.getPostsByuserId(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "User not found",
    });
  });

  test("should handle errors and return 500 status while getting all posts of an user", async () => {
    const userId = "acce27c5-9df8-4f8f-9b3f-24d314e5538a";
    postController = new PostController();
    mockRequest.params = { userId: userId };

    (UserService.prototype.getUserById as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    await postController.getPostsByuserId(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Internal Server Error",
    });
  });

  test("should update post based on the post id", async () => {
    const postId = "7cce27c5-9df8-4f8f-9b3f-24d314e5538a";
    const mockpost = {
      id: postId,
      title: "post one",
      content: "content of post one",
      user_id: "acce27c5-9df8-4f8f-9b3f-24d314e5538a",
    };
    const updatedPost = {
      id: postId,
      title: "updated post",
      content: "content of updated post",
      user_id: "acce27c5-9df8-4f8f-9b3f-24d314e5538a",
    };
    postController = new PostController();
    mockRequest.params = { id: postId };

    mockRequest.body = {
      title: "post one",
      content: "content of post one",
      userId: "acce27c5-9df8-4f8f-9b3f-24d314e5538a",
    };

    (PostService.prototype.getPostById as jest.Mock).mockResolvedValueOnce(
      mockpost
    );

    (PostService.prototype.updatePost as jest.Mock).mockResolvedValueOnce(
      updatedPost
    );

    await postController.updatePost(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockResponse.json).toHaveBeenCalledWith(updatedPost);
  });

  test("should handle post not found error and return 404 status code while updating the post", async () => {
    const postId = "7cce27c5-9df8-4f8f-9b3f-24d314e5538a";
    postController = new PostController();
    mockRequest.params = { id: postId };

    mockRequest.body = {
      title: "post one",
      content: "content of post one",
      userId: "acce27c5-9df8-4f8f-9b3f-24d314e5538a",
    };

    (PostService.prototype.getPostById as jest.Mock).mockResolvedValueOnce(
      null
    );

    await postController.updatePost(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Post not found",
    });
  });

  test("should handle user not authorized error and return 403 status code while updating the post", async () => {
    const postId = "7cce27c5-9df8-4f8f-9b3f-24d314e5538a";
    const mockpost = {
      id: postId,
      title: "post one",
      content: "content of post one",
      user_id: "1cce27c5-9df8-4f8f-9b3f-24d314e5538a",
    };
    postController = new PostController();
    mockRequest.params = { id: postId };

    mockRequest.body = {
      title: "post one",
      content: "content of post one",
      userId: "8cce27c5-9df8-4f8f-9b3f-24d314e5538a",
    };

    (PostService.prototype.getPostById as jest.Mock).mockResolvedValueOnce(
      mockpost
    );

    await postController.updatePost(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Unauthorized to update this post",
    });
  });

  test("should handle errors and return 500 status code while updating the post", async () => {
    const postId = "7cce27c5-9df8-4f8f-9b3f-24d314e5538a";
    postController = new PostController();
    mockRequest.params = { id: postId };

    mockRequest.body = {
      title: "post one",
      content: "content of post one",
      userId: "8cce27c5-9df8-4f8f-9b3f-24d314e5538a",
    };

    (PostService.prototype.getPostById as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    await postController.updatePost(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Internal server error",
    });
  });

});
