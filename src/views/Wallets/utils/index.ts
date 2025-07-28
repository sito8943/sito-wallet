import { WalletDto, UpdateWalletDto } from "lib";
import { WalletFormType } from "../types";

export const formToDto = ({
  id,
  name,
  description,
}: WalletFormType): UpdateWalletDto => ({
  id,
  name,
  description,
});

export const dtoToForm = (dto: WalletDto): WalletFormType => ({
  id: dto.id,
  name: dto.name,
  description: dto.description,
});

export const emptyWallet: WalletFormType = {
  id: 0,
  name: "",
  description: "",
};
