export interface AddUserDto {
  email: string;
  password: string;
  username?: string;
  admin?: boolean;
}
