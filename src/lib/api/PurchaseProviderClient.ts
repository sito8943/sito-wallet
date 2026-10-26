import { BaseClient, Methods } from "@sito/dashboard-app";

import { Tables } from "./types";
import type {
  AddPurchaseProviderDto,
  CommonPurchaseProviderDto,
  FilterPurchaseProviderDto,
  ImportPreviewDto,
  PurchaseProviderDto,
  UpdatePurchaseProviderDto,
} from "lib";
import { config } from "../../config";
import { uploadEntityPhoto } from "./fileUpload";

export default class PurchaseProviderClient extends BaseClient<
  Tables,
  PurchaseProviderDto,
  CommonPurchaseProviderDto,
  AddPurchaseProviderDto,
  UpdatePurchaseProviderDto,
  FilterPurchaseProviderDto,
  ImportPreviewDto,
  number
> {
  constructor() {
    super(Tables.PurchaseProviders, config.apiUrl, config.auth.user, true, {
      rememberKey: config.auth.remember,
      refreshTokenKey: config.auth.refreshTokenKey,
      accessTokenExpiresAtKey: config.auth.accessTokenExpiresAtKey,
    });
  }

  async updatePhoto(
    id: number,
    file: File,
  ): Promise<CommonPurchaseProviderDto> {
    return await uploadEntityPhoto<CommonPurchaseProviderDto>(
      `${config.apiUrl}${this.table}/${id}/photo`,
      file,
      this.api.defaultTokenAcquirer(),
    );
  }

  async deletePhoto(id: number): Promise<CommonPurchaseProviderDto> {
    return await this.api.doQuery<CommonPurchaseProviderDto>(
      `${this.table}/${id}/photo`,
      Methods.DELETE,
      undefined,
      this.api.defaultTokenAcquirer(),
    );
  }
}
