import type { BaseFilterDto, RangeValue } from "@sito/dashboard-app";

import type { NotificationType } from "./NotificationType";

export interface FilterNotificationDto extends BaseFilterDto {
  id?: number;
  type?: NotificationType;
  createdAt?: RangeValue<string>;
}
