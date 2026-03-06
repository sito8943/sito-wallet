import { BaseEntityDto } from "@sito/dashboard-app";

export interface CommonUserProfileDto {
  id: number;
  username: string;
}

export interface ProfileDto extends BaseEntityDto {
  name: string;
  description: string | null;
  photo: string | null;
  user: CommonUserProfileDto | null;
}
