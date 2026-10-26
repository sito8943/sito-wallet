import { BaseClient, Methods } from "@sito/dashboard-app";

import { Tables } from "./types";

import type {
  AddSubscriptionProviderDto,
  CommonSubscriptionProviderDto,
  FilterSubscriptionProviderDto,
  ImportDto,
  ImportPreviewSubscriptionProviderDto,
  PrefabSubscriptionProviderDto,
  SubscriptionProviderImportItemDto,
  SubscriptionProviderDto,
  UpdateSubscriptionProviderDto,
} from "lib";
import { parseJSONFile } from "lib";

import { config } from "../../config";
import { uploadEntityPhoto } from "./fileUpload";

export default class SubscriptionProviderClient extends BaseClient<
  Tables,
  SubscriptionProviderDto,
  CommonSubscriptionProviderDto,
  AddSubscriptionProviderDto,
  UpdateSubscriptionProviderDto,
  FilterSubscriptionProviderDto,
  ImportPreviewSubscriptionProviderDto
> {
  constructor() {
    super(Tables.SubscriptionProviders, config.apiUrl, config.auth.user, true, {
      rememberKey: config.auth.remember,
      refreshTokenKey: config.auth.refreshTokenKey,
      accessTokenExpiresAtKey: config.auth.accessTokenExpiresAtKey,
    });
  }

  async updatePhoto(id: number, file: File): Promise<SubscriptionProviderDto> {
    return await uploadEntityPhoto<SubscriptionProviderDto>(
      `${config.apiUrl}${this.table}/${id}/photo`,
      file,
      this.api.defaultTokenAcquirer(),
    );
  }

  async deletePhoto(id: number): Promise<SubscriptionProviderDto> {
    return await this.api.doQuery<SubscriptionProviderDto>(
      `${this.table}/${id}/photo`,
      Methods.DELETE,
      undefined,
      this.api.defaultTokenAcquirer(),
    );
  }

  async processImport(
    file: File,
    override?: boolean,
  ): Promise<ImportPreviewSubscriptionProviderDto[]> {
    const parsedOverride = override ? "true" : "false";
    const items = await parseJSONFile<SubscriptionProviderImportItemDto>(file);
    return await this.api.doQuery<ImportPreviewSubscriptionProviderDto[]>(
      `${this.table}/import/process?override=${parsedOverride}`,
      Methods.POST,
      items,
      this.api.defaultTokenAcquirer(),
    );
  }

  async import(
    data: ImportDto<ImportPreviewSubscriptionProviderDto>,
  ): Promise<number> {
    const parsedData: {
      override: boolean;
      items: SubscriptionProviderImportItemDto[];
    } = {
      override: data.override,
      items: data.items.map((item) => ({
        name: item.name,
        description: item.description ?? null,
        website: item.website ?? null,
        photo: item.photo ?? null,
      })),
    };

    return await this.api.post(`${this.table}/import`, parsedData);
  }

  async getPrefabs(params?: {
    country?: string;
    category?: string;
  }): Promise<PrefabSubscriptionProviderDto[]> {
    const search = new URLSearchParams();
    if (params?.country) search.set("country", params.country);
    if (params?.category) search.set("category", params.category);
    const query = search.toString();
    const path = `prefabs/subscription-providers${query ? `?${query}` : ""}`;
    return await this.api.doQuery<PrefabSubscriptionProviderDto[]>(
      path,
      Methods.GET,
    );
  }
}
