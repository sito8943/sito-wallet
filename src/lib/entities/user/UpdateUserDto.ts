export interface UpdateUserDto {
  id: number;
  email?: string;
  password?: string;
  username?: string;
  admin?: boolean;
}
