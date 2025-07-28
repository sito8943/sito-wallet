import { AccountDto, AddAccountDto, UpdateAccountDto } from "../../entities";

export interface Database {
  public: {
    Tables: {
      Accounts: {
        Row: AccountDto;
        Insert: AddAccountDto;
        Update: UpdateAccountDto;
      };
    };
  };
}
