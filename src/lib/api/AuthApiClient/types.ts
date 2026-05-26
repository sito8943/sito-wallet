import type { IAuthApiClient } from "@sito/dashboard-app";

import type { ChangePasswordDto } from "../../entities";

export interface WalletAuthApiClient extends IAuthApiClient {
  changePassword(data: ChangePasswordDto): Promise<void>;
}
