export type SyncEntity =
  | "currencies"
  | "accounts"
  | "transactionCategories"
  | "transactions"
  | "userDashboardConfigs"
  | "profile";

export const SYNC_ENTITY_ORDER: SyncEntity[] = [
  "currencies",
  "accounts",
  "transactionCategories",
  "transactions",
  "userDashboardConfigs",
  "profile",
];

export type SyncOperationType = "CREATE" | "UPDATE" | "DELETE" | "RESTORE";

export type SyncPayload = Record<string, unknown> | number;

export interface SyncQueueOperation {
  clientOperationId: string;
  entity: SyncEntity;
  operation: SyncOperationType;
  clientUpdatedAt: string;
  createdAt: string;
  payload: SyncPayload;
  localEntityId?: number;
}

export interface EnqueueSyncOperationInput {
  entity: SyncEntity;
  operation: SyncOperationType;
  payload: SyncPayload;
  localEntityId?: number;
}

export interface PreparedSyncOperation {
  clientOperationId: string;
  entity: SyncEntity;
  operation: SyncOperationType;
  clientUpdatedAt: string;
  payload: SyncPayload;
  sourceOperationIds: string[];
}

export interface SyncStatusResponse {
  connected: boolean;
  serverTime: string;
  lastSyncAt: string | null;
  deviceId: string | null;
  hasActiveSession: boolean;
}

export interface SyncStartSessionRequest {
  deviceId: string;
  clientTime: string;
  lastKnownSyncAt?: string | null;
  appVersion: string;
}

export interface SyncStartSessionResponse {
  sessionId: string;
  accepted: boolean;
  reason: string | null;
  serverTime: string;
  profileDeviceId: string | null;
  profileLastSyncAt: string | null;
}

export interface SyncBulkItemRequest {
  clientOperationId: string;
  operation: SyncOperationType;
  clientUpdatedAt: string;
  payload: SyncPayload;
}

export interface SyncBulkRequest {
  sessionId: string;
  entity?: SyncEntity;
  items: SyncBulkItemRequest[];
}

export interface SyncBulkErrorItem {
  clientOperationId: string;
  code:
    | "SYNC_DEVICE_CONFLICT"
    | "VALIDATION_ERROR"
    | "AUTH_ERROR"
    | "INTERNAL_ERROR";
  message: string;
}

export interface SyncBulkResponse {
  sessionId: string;
  entity: SyncEntity;
  received: number;
  applied: number;
  skipped: number;
  failed: number;
  errors: SyncBulkErrorItem[];
}

export interface SyncFinishSessionRequest {
  sessionId: string;
}

export interface SyncFinishSessionResponse {
  sessionId: string;
  status: "FINISHED" | "FAILED";
  serverTime: string;
  lastSyncAt: string | null;
}

export interface SyncCancelSessionRequest {
  sessionId: string;
  reason?: string;
}

export interface SyncCancelSessionResponse {
  sessionId: string;
  status: "CANCELED";
  serverTime: string;
  lastSyncAt: string | null;
}

export interface SyncMetadata {
  deviceId: string | null;
  lastSyncAt: string | null;
  activeSessionId: string | null;
}

export interface OfflineSyncRunResult {
  state: "idle" | "synced" | "partial";
  totalOperations: number;
  syncedOperations: number;
  failedOperations: number;
  errors: SyncBulkErrorItem[];
}

export interface SyncHttpError {
  status: number;
  message: string;
}

export type SyncSocketEventType =
  | "SYNC_CONNECTION_ACK"
  | "SYNC_SESSION_OPENED"
  | "SYNC_BULK_PROGRESS"
  | "SYNC_SESSION_FINISHED"
  | "SYNC_SESSION_ERROR";

export interface SyncSocketConnectionAckEvent {
  event: "SYNC_CONNECTION_ACK";
  connected: boolean;
  serverTime: string;
  lastSyncAt: string | null;
}

export interface SyncSocketSessionOpenedEvent {
  event: "SYNC_SESSION_OPENED";
  sessionId: string;
  serverTime: string;
}

export interface SyncSocketBulkProgressEvent {
  event: "SYNC_BULK_PROGRESS";
  sessionId: string;
  entity: SyncEntity;
  applied: number;
  total: number;
  serverTime: string;
}

export interface SyncSocketSessionFinishedEvent {
  event: "SYNC_SESSION_FINISHED";
  sessionId: string;
  lastSyncAt: string | null;
  serverTime: string;
}

export interface SyncSocketSessionErrorEvent {
  event: "SYNC_SESSION_ERROR";
  sessionId: string;
  code:
    | "SYNC_DEVICE_CONFLICT"
    | "VALIDATION_ERROR"
    | "AUTH_ERROR"
    | "INTERNAL_ERROR";
  message: string;
  serverTime: string;
}

export type SyncSocketEvent =
  | SyncSocketConnectionAckEvent
  | SyncSocketSessionOpenedEvent
  | SyncSocketBulkProgressEvent
  | SyncSocketSessionFinishedEvent
  | SyncSocketSessionErrorEvent;
