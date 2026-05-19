import type { SessionAccountDto, SessionDto } from "@sito/dashboard-app";

export enum FormMode {
  Add,
  Edit,
}

export type WalletSessionExtra = {
  admin?: boolean;
};

export type WalletSessionDto = SessionDto<WalletSessionExtra>;
export type WalletSessionAccountDto = SessionAccountDto<WalletSessionExtra>;
