import { BaseClient, Methods } from "@sito/dashboard-app";

import { Tables } from "./types";
import type {
  AddGoalDto,
  CommonGoalDto,
  FilterGoalDto,
  GoalDto,
  ImportPreviewDto,
  UpdateGoalDto,
} from "lib";
import { config } from "../../config";
import { uploadEntityPhoto } from "./fileUpload";

export default class GoalClient extends BaseClient<
  Tables,
  GoalDto,
  CommonGoalDto,
  AddGoalDto,
  UpdateGoalDto,
  FilterGoalDto,
  ImportPreviewDto,
  number
> {
  constructor() {
    super(
      Tables.Goals,
      config.apiUrl,
      config.auth.user,
      true,
      config.auth.clientConfig,
    );
  }

  private async patchStatus(id: number, action: string): Promise<GoalDto> {
    return await this.api.doQuery<GoalDto>(
      `${this.table}/${id}/${action}`,
      Methods.PATCH,
      undefined,
      this.api.defaultTokenAcquirer(),
    );
  }

  /** Marks the goal as COMPLETED (sets `completedAt`). */
  async complete(id: number): Promise<GoalDto> {
    return await this.patchStatus(id, "complete");
  }

  async cancel(id: number): Promise<GoalDto> {
    return await this.patchStatus(id, "cancel");
  }

  /** Back to ACTIVE; clears `completedAt`. */
  async reopen(id: number): Promise<GoalDto> {
    return await this.patchStatus(id, "reopen");
  }

  async updatePhoto(id: number, file: File): Promise<GoalDto> {
    return await uploadEntityPhoto<GoalDto>(
      `${config.apiUrl}${this.table}/${id}/photo`,
      file,
      this.api.defaultTokenAcquirer(),
    );
  }

  async deletePhoto(id: number): Promise<GoalDto> {
    return await this.api.doQuery<GoalDto>(
      `${this.table}/${id}/photo`,
      Methods.DELETE,
      undefined,
      this.api.defaultTokenAcquirer(),
    );
  }
}
