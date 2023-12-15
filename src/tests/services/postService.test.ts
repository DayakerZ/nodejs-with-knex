import knex, { Knex, QueryBuilder } from "knex";
import { PostService } from "../../services/postService";
import { producePost } from "../../producer";
import Redis from "ioredis";

jest.mock("ioredis");
jest.mock("../../producer");
jest.mock("knex");

describe("PostService", () => {
  let postService: PostService;
  let mockKnex: Knex | Knex.Transaction;
  const mockFrom = jest.fn();
  const mockSelect = jest.fn();
  const mockWhere = jest.fn();
  const mockFirst = jest.fn();
  const mockInsert = jest.fn();
  const mockDel = jest.fn();
  beforeEach(() => {
    mockKnex = {} as Knex | Knex.Transaction;
    postService = new PostService(mockKnex as Knex);
    jest.clearAllMocks();
  });

  test("should return post based on the id provided", async () => {
    // Arrange
    const postId = "7cce27c5-9df8-4f8f-9b3f-24d314e5538a";
    const post = {
      id: "7cce27c5-9df8-4f8f-9b3f-24d314e5538a",
      title: "teat post",
      content: "content of the post",
      user_id: "1cce27c5-9df8-4f8f-9b3f-24d314e5538a",
    };
    mockKnex.select = mockSelect.mockReturnThis();
    mockKnex.from = mockFrom.mockReturnThis();
    mockKnex.where = mockWhere.mockReturnThis();
    mockKnex.first = mockFirst.mockResolvedValueOnce(post);
    // Act
    const result = await postService.getPostById(postId);

    // Assert
    expect(mockKnex.select).toHaveBeenCalledWith("*");
    expect(mockKnex.from).toHaveBeenCalledWith("posts");
    expect(mockKnex.where).toHaveBeenCalledWith({ id: postId });
    expect(mockKnex.first).toHaveBeenCalledWith();
    expect(result).toEqual(post);
  });

  test("should create a create a post and return the created post", async () => {
    const title = "test post";
    const content = "post content";
    const user_id = "1cce27c5-9df8-4f8f-9b3f-24d314e5538a";

    const mockPost = {
      id: "7cce27c5-9df8-4f8f-9b3f-24d314e5538a",
      title: title,
      content: content,
      user_id: user_id,
    };
    mockKnex.from = mockFrom.mockReturnThis();
    mockKnex.insert = mockInsert.mockResolvedValue([mockPost]);

    const result = await postService.createPost(title, content, user_id);

    expect(result).toEqual(mockPost);
    expect(mockKnex.from).toHaveBeenCalledWith("posts");
    expect(mockKnex.insert).toHaveBeenCalledWith({ title, content, user_id }, [
      "id",
      "title",
      "content",
      "user_id",
    ]);
    expect(producePost).toHaveBeenCalledWith(mockPost);
  });

  test("should delete the post with id and return deleted post", async () => {
    const postId = "123";
    const mockPost = {
      id: "7cce27c5-9df8-4f8f-9b3f-24d314e5538a",
      title: "teat post",
      content: "content of the post",
      user_id: "1cce27c5-9df8-4f8f-9b3f-24d314e5538a",
    };

    mockKnex.select = mockSelect.mockReturnThis();
    mockKnex.first = mockFirst.mockResolvedValueOnce(mockPost);

    mockKnex.from = mockFrom.mockReturnThis();
    mockKnex.where = mockWhere.mockReturnThis();
    mockKnex.del = mockDel.mockReturnThis();

    const result = await postService.deletePost(postId);

    expect(mockKnex.select).toHaveBeenCalledWith("*");
    expect(mockKnex.from).toHaveBeenCalledWith("posts");
    expect(mockKnex.where).toHaveBeenCalledWith({ id: postId });
    expect(mockKnex.del).toHaveBeenCalledWith();
    expect(result).toEqual(mockPost);
  });

  test("should return when the id is not present in the db", async () => {
    const postId = "123";

    mockKnex.select = mockSelect.mockReturnThis();
    mockKnex.first = mockFirst.mockResolvedValueOnce(null);
    mockKnex.from = mockFrom.mockReturnThis();
    mockKnex.where = mockWhere.mockReturnThis();

    const result = await postService.deletePost(postId);

    expect(mockKnex.select).toHaveBeenCalledWith("*");
    expect(mockKnex.from).toHaveBeenCalledWith("posts");
    expect(mockKnex.where).toHaveBeenCalledWith({ id: postId });
    expect(mockKnex.first).toHaveBeenCalledWith();
    expect(result).toEqual(null);
  });
});
