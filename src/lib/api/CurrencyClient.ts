import { BaseClient, Methods } from "@sito/dashboard-app";

// enum
import { Tables } from "./types";

// types
import type {
  CommonCurrencyDto,
  CurrencyDto,
  UpdateCurrencyDto,
  FilterCurrencyDto,
  AddCurrencyDto,
  ImportPreviewCurrencyDto,
  ImportDto} from "lib";
import {
  parseJSONFile
} from "lib";

// config
import { config } from "../../config";

export default class CurrencyClient extends BaseClient<
  Tables,
  CurrencyDto,
  CommonCurrencyDto,
  AddCurrencyDto,
  UpdateCurrencyDto,
  FilterCurrencyDto,
  ImportPreviewCurrencyDto
> {
  /**
   */
  constructor() {
    super(Tables.Currencies, config.apiUrl, config.auth.user, true, {
      rememberKey: config.auth.remember,
      refreshTokenKey: config.auth.refreshTokenKey,
      accessTokenExpiresAtKey: config.auth.accessTokenExpiresAtKey,
    });
  }

  async processImport(
    file: File,
    override?: boolean,
  ): Promise<ImportPreviewCurrencyDto[]> {
    const items = await parseJSONFile<CurrencyDto>(file);
    return await this.api.doQuery<ImportPreviewCurrencyDto[]>(
      `${this.table}/import/process${override ? `?override=true` : ""}`,
      Methods.POST,
      items,
      {
        ...this.api.defaultTokenAcquirer(),
      },
    );
  }

  async import(data: ImportDto<ImportPreviewCurrencyDto>): Promise<number> {
    return await this.api.post(`${this.table}/import`, data);
  }
}
