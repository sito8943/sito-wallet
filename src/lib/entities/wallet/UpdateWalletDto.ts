import { WalletDto } from "lib";

export interface UpdateWalletDto
  extends Omit<WalletDto, "updatedAt" | "deleted" | "createdAt"> {
  name: string;
  description: string;
}
