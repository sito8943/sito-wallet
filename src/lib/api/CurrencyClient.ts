import { BaseClient, Methods } from "@sito/dashboard-app";

// enum
import { Tables } from "./types";

// types
import {
  CommonCurrencyDto,
  CurrencyDto,
  UpdateCurrencyDto,
  FilterCurrencyDto,
  AddCurrencyDto,
  parseJSONFile,
  ImportPreviewCurrencyDto,
  ImportDto,
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
    super(Tables.Currencies, config.apiUrl, config.auth.user);
  }

  async processImport(
    file: File,
    override?: boolean
  ): Promise<ImportPreviewCurrencyDto[]> {
    const items = await parseJSONFile<CurrencyDto>(file);
    return await this.api.doQuery<ImportPreviewCurrencyDto[]>(
      `${this.table}/import/process${override ? `?override=true` : ""}`,
      Methods.POST,
      items,
      {
        ...this.api.defaultTokenAcquirer(),
      }
    );
  }

  async import(data: ImportDto<ImportPreviewCurrencyDto>): Promise<number> {
    return await this.api.post(`${this.table}/import`, data);
  }
}
