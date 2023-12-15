import { Knex } from "knex";
import { UserService } from "../../services/userService";
import Redis from "ioredis";

jest.mock("ioredis");

describe("UserService", () => {
  let userService: UserService;
  let mockKnex: Knex;
  const mockFrom = jest.fn();
  const mockSelect = jest.fn();
  const mockWhere = jest.fn();
  const mockFirst = jest.fn();
  const mockInsert = jest.fn();
  const mockReturning = jest.fn();
  const mockUpdate = jest.fn();
  beforeEach(() => {
    mockKnex = {} as Knex;
    userService = new UserService(mockKnex as Knex);
    
    jest.clearAllMocks();
  });

  test("should return cached users if available", async () => {
    // Mock Redis get method to return cached users
    (Redis.prototype.get as jest.Mock).mockResolvedValueOnce(
      JSON.stringify([{ id: 1, username: "test" }])
    );

    const result = await userService.getAllUsers();

    expect(result).toEqual([{ id: 1, username: "test" }]);
    expect(Redis.prototype.get).toHaveBeenCalledWith("allUsers");
  });

  test("should return all users", async () => {
    // Arrange
    (Redis.prototype.get as jest.Mock).mockResolvedValueOnce(null);
    (Redis.prototype.set as jest.Mock).mockResolvedValueOnce("OK");
    const users = [{ id: 1, username: "testuser", email: "test@example.com" }];
    mockKnex.select = mockSelect.mockReturnThis();
    mockKnex.from = mockFrom.mockReturnThis().mockResolvedValue(users);

    // Act
    const result = await userService.getAllUsers();

    // Assert
    expect(mockKnex.select).toHaveBeenCalledWith("*");
    expect(mockKnex.from).toHaveBeenCalledWith("users");
    expect(result).toEqual(users);
  });

  test("should return user based on the id provided", async () => {
    // Arrange
    const userId = "7cce27c5-9df8-4f8f-9b3f-24d314e5538a";
    const user = {
      id: "7cce27c5-9df8-4f8f-9b3f-24d314e5538a",
      username: "testuser",
      email: "test@example.com",
    };
    mockKnex.select = mockSelect.mockReturnThis();
    mockKnex.from = mockFrom.mockReturnThis();
    mockKnex.where = mockWhere.mockReturnThis();
    mockKnex.first = mockFirst.mockResolvedValueOnce(user);
    // Act
    const result = await userService.getUserById(userId);

    // Assert
    expect(mockKnex.select).toHaveBeenCalledWith("*");
    expect(mockKnex.from).toHaveBeenCalledWith("users");
    expect(mockKnex.where).toHaveBeenCalledWith({ id: userId });
    expect(mockKnex.first).toHaveBeenCalledWith();
    expect(result).toEqual(user);
  });

  test("should create a new user", async () => {
    // Arrange
    const username = "newuser";
    const email = "newuser@example.com";
    const newUser = { id: "newUserId", username, email };
    mockKnex.from = mockFrom.mockReturnThis();
    mockKnex.insert = mockInsert.mockResolvedValueOnce([newUser]);

    // Act
    const result = await userService.createUser(username, email);

    // Assert
    expect(mockKnex.insert).toHaveBeenCalledWith({ username, email }, [
      "id",
      "username",
      "email",
    ]);
    expect(mockKnex.from).toHaveBeenCalledWith("users");
    expect(result).toEqual(newUser);
  });

  test("should update user based on the provided id", async () => {
    // Arrange
    const userId = "7cce27c5-9df8-4f8f-9b3f-24d314e5538a";
    const username = "updateduser";
    const email = "updateduser@example.com";
    const updatedUser = {
      id: "7cce27c5-9df8-4f8f-9b3f-24d314e5538a",
      username: "updateduser",
      email: "updateduser@example.com",
    };

    mockKnex.from = mockFrom.mockReturnThis();
    mockKnex.where = mockWhere.mockReturnThis();
    mockKnex.update = mockUpdate.mockReturnThis(); // Assuming 1 row is updated
    mockKnex.returning = mockReturning.mockResolvedValueOnce([updatedUser]);

    // Act
    const result = await userService.updateUser(userId, username, email);

    // Assert
    expect(mockKnex.from).toHaveBeenCalledWith("users");
    expect(mockKnex.where).toHaveBeenCalledWith({ id: userId });
    expect(mockKnex.update).toHaveBeenCalledWith({ username, email });
    expect(mockKnex.returning).toHaveBeenCalledWith("*");
    expect(result).toEqual(updatedUser);
  });
});
