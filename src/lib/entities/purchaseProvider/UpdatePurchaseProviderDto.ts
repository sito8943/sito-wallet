import type { AddPurchaseProviderDto } from "./AddPurchaseProviderDto";
import type { DeleteDto } from "@sito/dashboard-app";

export interface UpdatePurchaseProviderDto
  extends AddPurchaseProviderDto, DeleteDto {}
