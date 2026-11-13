import { APIClient, Methods } from "@sito/dashboard-app";

// enum
import { Tables } from "./types";

// config
import { config } from "../../config";

// types
import type { AddFeedbackDto, FeedbackDto, SetFeedbackResolvedDto } from "lib";

/** Feedback inbox. Listing and resolving are admin only (403 otherwise). */
export default class FeedbackClient {
  table: Tables = Tables.Feedback;
  api: APIClient = new APIClient(
    config.apiUrl,
    config.auth.user,
    true,
    undefined,
    config.auth.clientConfig,
  );

  /** Every entry, newest first (up to 200). Admins only. */
  async list(): Promise<FeedbackDto[]> {
    return await this.api.doQuery<FeedbackDto[]>(
      this.table,
      Methods.GET,
      undefined,
      this.api.defaultTokenAcquirer(),
    );
  }

  /** Marks an entry as resolved, or reopens it. Admins only. */
  async setResolved(id: number, resolved: boolean): Promise<void> {
    await this.api.doQuery<void, SetFeedbackResolvedDto>(
      `${this.table}/${id}/resolved`,
      Methods.PUT,
      { resolved },
      this.api.defaultTokenAcquirer(),
    );
  }

  /** Sends feedback as the current user. */
  async send(data: AddFeedbackDto): Promise<void> {
    await this.api.doQuery<void, AddFeedbackDto>(
      this.table,
      Methods.POST,
      data,
      this.api.defaultTokenAcquirer(),
    );
  }
}
