import { Client, IMessage, StompSubscription } from "@stomp/stompjs";

import { config } from "../../../config";
import {
  SYNC_ENTITY_ORDER,
  SyncSocketBulkProgressEvent,
  SyncSocketConnectionAckEvent,
  SyncSocketEvent,
  SyncSocketSessionErrorEvent,
  SyncSocketSessionFinishedEvent,
  SyncSocketSessionOpenedEvent,
} from "./types";

const SYNC_SOCKET_DESTINATION = "/user/queue/sync-status";
const SYNC_SOCKET_PATH = "/ws";

type SyncSocketHandlers = {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onEvent?: (event: SyncSocketEvent) => void;
  onStompError?: (message: string) => void;
};

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string => typeof value === "string";
const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);
const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";

const buildSocketUrl = (apiBaseUrl: string): string | null => {
  try {
    const parsed = new URL(apiBaseUrl, window.location.origin);
    const protocol = parsed.protocol === "https:" ? "wss:" : "ws:";
    const pathname = parsed.pathname.endsWith("/")
      ? parsed.pathname.slice(0, -1)
      : parsed.pathname;
    const basePath = pathname === "/" ? "" : pathname;
    return `${protocol}//${parsed.host}${basePath}${SYNC_SOCKET_PATH}`;
  } catch {
    return null;
  }
};

const syncEntities = new Set<string>(SYNC_ENTITY_ORDER);

const isSyncEntity = (
  value: unknown,
): value is SyncSocketBulkProgressEvent["entity"] =>
  isString(value) && syncEntities.has(value);

const parseSocketEvent = (raw: unknown): SyncSocketEvent | null => {
  if (!isObjectRecord(raw) || !isString(raw.event)) return null;

  if (raw.event === "SYNC_CONNECTION_ACK") {
    if (
      !isBoolean(raw.connected) ||
      !isString(raw.serverTime) ||
      !(raw.lastSyncAt === null || isString(raw.lastSyncAt))
    )
      return null;

    return {
      event: "SYNC_CONNECTION_ACK",
      connected: raw.connected,
      serverTime: raw.serverTime,
      lastSyncAt: raw.lastSyncAt,
    } satisfies SyncSocketConnectionAckEvent;
  }

  if (raw.event === "SYNC_SESSION_OPENED") {
    if (!isString(raw.sessionId) || !isString(raw.serverTime)) return null;

    return {
      event: "SYNC_SESSION_OPENED",
      sessionId: raw.sessionId,
      serverTime: raw.serverTime,
    } satisfies SyncSocketSessionOpenedEvent;
  }

  if (raw.event === "SYNC_BULK_PROGRESS") {
    if (
      !isString(raw.sessionId) ||
      !isSyncEntity(raw.entity) ||
      !isNumber(raw.applied) ||
      !isNumber(raw.total) ||
      !isString(raw.serverTime)
    )
      return null;

    return {
      event: "SYNC_BULK_PROGRESS",
      sessionId: raw.sessionId,
      entity: raw.entity,
      applied: raw.applied,
      total: raw.total,
      serverTime: raw.serverTime,
    } satisfies SyncSocketBulkProgressEvent;
  }

  if (raw.event === "SYNC_SESSION_FINISHED") {
    if (
      !isString(raw.sessionId) ||
      !(raw.lastSyncAt === null || isString(raw.lastSyncAt)) ||
      !isString(raw.serverTime)
    )
      return null;

    return {
      event: "SYNC_SESSION_FINISHED",
      sessionId: raw.sessionId,
      lastSyncAt: raw.lastSyncAt,
      serverTime: raw.serverTime,
    } satisfies SyncSocketSessionFinishedEvent;
  }

  if (raw.event === "SYNC_SESSION_ERROR") {
    if (
      !isString(raw.sessionId) ||
      !isString(raw.code) ||
      !isString(raw.message) ||
      !isString(raw.serverTime)
    )
      return null;

    return {
      event: "SYNC_SESSION_ERROR",
      sessionId: raw.sessionId,
      code: raw.code as SyncSocketSessionErrorEvent["code"],
      message: raw.message,
      serverTime: raw.serverTime,
    } satisfies SyncSocketSessionErrorEvent;
  }

  return null;
};

export class SyncSocketService {
  private client: Client | null = null;
  private subscription: StompSubscription | null = null;
  private handlers: SyncSocketHandlers = {};

  private parseMessage(message: IMessage): SyncSocketEvent | null {
    try {
      const parsed = JSON.parse(message.body) as unknown;
      return parseSocketEvent(parsed);
    } catch {
      return null;
    }
  }

  private getAuthorizationHeader(): string | null {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem(config.auth.user);
    if (!token) return null;
    return `Bearer ${token}`;
  }

  private subscribeToUserQueue(): void {
    if (!this.client || !this.client.connected) return;

    this.subscription?.unsubscribe();
    this.subscription = this.client.subscribe(
      SYNC_SOCKET_DESTINATION,
      (message) => {
        const event = this.parseMessage(message);
        if (!event) return;
        this.handlers.onEvent?.(event);
      },
    );
  }

  connect(handlers: SyncSocketHandlers = {}): void {
    this.handlers = handlers;

    if (this.client?.active) return;

    const brokerURL = buildSocketUrl(config.apiUrl);
    if (!brokerURL) return;

    const authorization = this.getAuthorizationHeader();
    const connectHeaders = authorization
      ? { Authorization: authorization }
      : undefined;

    this.client = new Client({
      brokerURL,
      connectHeaders,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: () => undefined,
      onConnect: () => {
        this.subscribeToUserQueue();
        this.handlers.onConnect?.();
      },
      onDisconnect: () => {
        this.handlers.onDisconnect?.();
      },
      onWebSocketClose: () => {
        this.handlers.onDisconnect?.();
      },
      onStompError: (frame) => {
        const message = frame.headers.message || frame.body || "STOMP error";
        this.handlers.onStompError?.(message);
      },
    });

    this.client.activate();
  }

  disconnect(): void {
    this.subscription?.unsubscribe();
    this.subscription = null;

    if (this.client?.active) {
      this.client.deactivate();
    }
    this.client = null;
  }
}

export const syncSocketService = new SyncSocketService();
