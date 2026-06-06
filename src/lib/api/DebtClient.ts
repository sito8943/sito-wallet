import type { QueryParam, QueryResult } from "@sito/dashboard-app";
import { BaseClient, Methods, parseQueries } from "@sito/dashboard-app";

import { Tables } from "./types";

import type {
  AddDebtDto,
  AddDebtPaymentDto,
  CommonDebtDto,
  DebtDto,
  DebtPaymentDto,
  FilterDebtDto,
  FilterDebtPaymentDto,
  ImportPreviewDebtDto,
  UpdateDebtDto,
} from "lib";

import { config } from "../../config";

export default class DebtClient extends BaseClient<
  Tables,
  DebtDto,
  CommonDebtDto,
  AddDebtDto,
  UpdateDebtDto,
  FilterDebtDto,
  ImportPreviewDebtDto
> {
  constructor() {
    super(Tables.Debts, config.apiUrl, config.auth.user, true, {
      rememberKey: config.auth.remember,
      refreshTokenKey: config.auth.refreshTokenKey,
      accessTokenExpiresAtKey: config.auth.accessTokenExpiresAtKey,
    });
  }

  async cancel(debtId: number): Promise<number> {
    return await this.api.patch(`${this.table}/${debtId}/cancel`, undefined);
  }

  async createPayment(
    debtId: number,
    data: AddDebtPaymentDto,
  ): Promise<DebtPaymentDto> {
    return await this.api.post(`${this.table}/${debtId}/payments`, data);
  }

  async getPayments(
    debtId: number,
    query?: QueryParam<DebtPaymentDto>,
    filters?: FilterDebtPaymentDto,
  ): Promise<QueryResult<DebtPaymentDto>> {
    const builtUrl = parseQueries<DebtPaymentDto, FilterDebtPaymentDto>(
      `${this.table}/${debtId}/payments`,
      query,
      filters,
    );

    return await this.api.doQuery<QueryResult<DebtPaymentDto>>(
      builtUrl,
      Methods.GET,
      undefined,
      {
        ...this.api.defaultTokenAcquirer(),
      },
    );
  }

  async deletePayment(debtId: number, paymentId: number): Promise<number> {
    return await this.api.doQuery<number>(
      `${this.table}/${debtId}/payments/${paymentId}`,
      Methods.DELETE,
      undefined,
      {
        ...this.api.defaultTokenAcquirer(),
      },
    );
  }
}
