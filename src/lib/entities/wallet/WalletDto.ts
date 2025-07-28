import { BaseEntityDto, CommonWalletDto } from "lib";

export interface WalletDto extends CommonWalletDto, BaseEntityDto {
  name: string;
  description: string;
}
