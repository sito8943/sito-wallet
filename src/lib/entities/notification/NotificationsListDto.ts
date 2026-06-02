import type { NotificationDto } from "./NotificationDto";

export interface NotificationsListDto {
  items: NotificationDto[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}
