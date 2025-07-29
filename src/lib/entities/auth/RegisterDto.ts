import { AuthDto } from "./AuthDto";

export interface RegisterDto extends AuthDto {
  rPassword: string;
}
