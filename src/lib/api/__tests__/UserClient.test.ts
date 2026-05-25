import { beforeEach, describe, expect, it, vi } from "vitest";

const mockPost = vi.fn();

vi.mock("@sito/dashboard-app", () => ({
  BaseClient: class {
    api = {
      post: mockPost,
    };

    table = "users";
  },
}));

import UserClient from "../UserClient";

describe("UserClient", () => {
  beforeEach(() => {
    mockPost.mockReset();
  });

  it("posts the reset request payload", async () => {
    mockPost.mockResolvedValue(undefined);

    const client = new UserClient();
    await client.reset(42, true);

    expect(mockPost).toHaveBeenCalledWith("users/42/reset", {
      hard: true,
    });
  });

  it("propagates reset errors to the caller", async () => {
    const error = new Error("reset failed");
    mockPost.mockRejectedValue(error);

    const client = new UserClient();

    await expect(client.reset(7, false)).rejects.toBe(error);
  });
});
