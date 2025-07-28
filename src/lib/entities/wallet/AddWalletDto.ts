import { WalletDto } from "lib";

export interface AddWalletDto
  extends Omit<WalletDto, "id" | "updatedAt" | "createdAt" | "deleted"> {
  name: string;
  description: string;
}
