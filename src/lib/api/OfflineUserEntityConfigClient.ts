import type {
  UserEntityConfigBatchDto,
  UserEntityConfigDto,
} from "./userEntityConfigs";

export class OfflineUserEntityConfigClient {
  async getAll(): Promise<UserEntityConfigDto[]> {
    return [];
  }

  async putBatch(
    payload: UserEntityConfigBatchDto,
  ): Promise<UserEntityConfigDto[]> {
    if ("entities" in payload) return payload.entities;

    return [];
  }

  async patchBatch(
    payload: UserEntityConfigBatchDto,
  ): Promise<UserEntityConfigDto[]> {
    if ("entities" in payload) return payload.entities;

    return [];
  }
}
