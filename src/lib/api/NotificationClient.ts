import {
  BaseClient,
  type DeleteDto,
  Methods,
  parseQueries,
} from "@sito/dashboard-app";

import type {
  FilterNotificationDto,
  GetNotificationsDto,
  ImportPreviewDto,
  NotificationDto,
  NotificationsListDto,
  ReadNotificationsDto,
} from "lib";
import { Tables } from "./types";

import { config } from "../../config";

const appendUnreadQueryParam = (path: string, unread?: boolean): string => {
  if (typeof unread !== "boolean") return path;

  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}unread=${String(unread)}`;
};

export default class NotificationClient extends BaseClient<
  Tables,
  NotificationDto,
  NotificationDto,
  NotificationDto,
  DeleteDto,
  FilterNotificationDto,
  ImportPreviewDto
> {
  constructor() {
    super(Tables.Notifications, config.apiUrl, config.auth.user, true, {
      rememberKey: config.auth.remember,
      refreshTokenKey: config.auth.refreshTokenKey,
      accessTokenExpiresAtKey: config.auth.accessTokenExpiresAtKey,
    });
  }

  async getAll(params?: GetNotificationsDto): Promise<NotificationsListDto> {
    const builtUrl = parseQueries<NotificationDto, FilterNotificationDto>(
      this.table,
      params?.query,
      params?.filters,
    );

    return await this.api.doQuery<NotificationsListDto>(
      appendUnreadQueryParam(builtUrl, params?.unread),
      Methods.GET,
      undefined,
      {
        ...this.api.defaultTokenAcquirer(),
      },
    );
  }

  async markAsRead(data: ReadNotificationsDto): Promise<number> {
    return await this.api.patch(`${this.table}/read`, data);
  }
}
