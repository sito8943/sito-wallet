import { BaseClient, Methods } from "@sito/dashboard-app";

// enum
import { Tables } from "./types";

// types
import {
  CommonTransactionCategoryDto,
  TransactionCategoryDto,
  UpdateTransactionCategoryDto,
  FilterTransactionCategoryDto,
  AddTransactionCategoryDto,
  ImportPreviewTransactionCategoryDto,
  ImportDto,
  parseJSONFile,
} from "lib";

// config
import { config } from "../../config";

export default class TransactionCategoryClient extends BaseClient<
  Tables,
  TransactionCategoryDto,
  CommonTransactionCategoryDto,
  AddTransactionCategoryDto,
  UpdateTransactionCategoryDto,
  FilterTransactionCategoryDto,
  ImportPreviewTransactionCategoryDto
> {
  /**
   */
  constructor() {
    super(Tables.TransactionCategories, config.apiUrl, config.auth.user);
  }

  async processImport(
    file: File,
    override?: boolean
  ): Promise<ImportPreviewTransactionCategoryDto[]> {
    const items = await parseJSONFile<TransactionCategoryDto>(file);
    return await this.api.doQuery<ImportPreviewTransactionCategoryDto[]>(
      `${this.table}/import/process${override ? `?override=true` : ""}`,
      Methods.POST,
      items,
      {
        ...this.api.defaultTokenAcquirer(),
      }
    );
  }

  async import(
    data: ImportDto<ImportPreviewTransactionCategoryDto>
  ): Promise<number> {
    return await this.api.post(`${this.table}/import`, data);
  }
}
