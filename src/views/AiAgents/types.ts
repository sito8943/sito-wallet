import type { Control, FieldValues } from "react-hook-form";

// @sito/dashboard-app
import type {
  ConfirmationDialogPropsType,
  TriggerFormDialogPropsType,
  UseFormDialogReturnType,
} from "@sito/dashboard-app";

// lib
import type {
  ApiKeyDto,
  CreatedApiKeyDto,
  McpAccess,
  McpArea,
  McpClient,
  OAuthGrantDto,
} from "lib";

// constants
import type { MCP_CONNECTOR_TAB } from "./constants";

/** Create and edit form of an API key (id only when editing). */
export interface ApiKeyFormType extends FieldValues {
  id?: number;
  name: string;
  access: McpAccess;
  areas: McpArea[];
}

export type CreateApiKeyDialogPropsType =
  TriggerFormDialogPropsType<ApiKeyFormType>;

export type EditApiKeyDialogPropsType = UseEditApiKeyDialogReturnType;

export interface ApiKeyFormFieldsPropsType {
  control: Control<ApiKeyFormType>;
  isLoading?: boolean;
}

export interface UseCreateApiKeyDialogReturnType extends UseFormDialogReturnType<ApiKeyFormType> {
  /** Key just created (full secret), shown once and then discarded. */
  createdKey: CreatedApiKeyDto | null;
  clearCreatedKey: () => void;
}

export interface UseEditApiKeyDialogReturnType extends UseFormDialogReturnType<ApiKeyFormType> {
  openForKey: (apiKey: ApiKeyDto) => void;
}

export interface UseRevokeApiKeyDialogReturnType extends ConfirmationDialogPropsType {
  target: ApiKeyDto | null;
  openForKey: (apiKey: ApiKeyDto) => void;
}

export type RevokeApiKeyDialogPropsType = UseRevokeApiKeyDialogReturnType;

/** ConfirmationDialog props plus the primary button's label (the action). */
export interface ActionConfirmDialogPropsType extends ConfirmationDialogPropsType {
  confirmLabel: string;
}

export interface CreatedApiKeyDialogPropsType {
  createdKey: CreatedApiKeyDto | null;
  mcpUrl: string;
  handleClose: () => void;
}

export interface ApiKeyListItemPropsType {
  apiKey: ApiKeyDto;
  onEdit: (apiKey: ApiKeyDto) => void;
  onRevoke: (apiKey: ApiKeyDto) => void;
  disabled?: boolean;
}

export interface ApiKeysSectionPropsType {
  apiKeys: ApiKeyDto[];
  isLoading: boolean;
  hasError: boolean;
  onRetry: () => void;
  onCreate: () => void;
  onEdit: (apiKey: ApiKeyDto) => void;
  onRevoke: (apiKey: ApiKeyDto) => void;
}

export interface McpSetupInstructionsPropsType {
  mcpUrl: string;
  /** Full key to fill in the snippets; the placeholder is used without it. */
  apiKey?: string | null;
  /** Adds the ChatGPT / claude.ai tab (OAuth, no key). Defaults to true. */
  withConnector?: boolean;
}

/** Id of a setup tab: a snippet client or the OAuth connector. */
export type McpSetupTabId = McpClient | typeof MCP_CONNECTOR_TAB;

export interface McpConnectorStepsPropsType {
  mcpUrl: string;
}

export interface ConnectedAppsSectionPropsType {
  /** Grants of this wallet's MCP server only. */
  grants: OAuthGrantDto[];
  isLoading: boolean;
  hasError: boolean;
  onRetry: () => void;
  onEdit: (grant: OAuthGrantDto) => void;
  onDisconnect: (grant: OAuthGrantDto) => void;
}

/** Edit form of a connected app: its access level and areas. */
export interface ConnectedAppFormType extends FieldValues {
  id: number;
  access: McpAccess;
  areas: McpArea[];
}

export interface ConnectedAppFormFieldsPropsType {
  control: Control<ConnectedAppFormType>;
  isLoading?: boolean;
}

export interface UseEditConnectedAppDialogReturnType extends UseFormDialogReturnType<ConnectedAppFormType> {
  openForGrant: (grant: OAuthGrantDto) => void;
}

export type EditConnectedAppDialogPropsType =
  UseEditConnectedAppDialogReturnType;

export interface ConnectedAppListItemPropsType {
  grant: OAuthGrantDto;
  onEdit: (grant: OAuthGrantDto) => void;
  onDisconnect: (grant: OAuthGrantDto) => void;
  disabled?: boolean;
}

export interface UseDisconnectAppDialogReturnType extends ConfirmationDialogPropsType {
  target: OAuthGrantDto | null;
  openForGrant: (grant: OAuthGrantDto) => void;
}

export type DisconnectAppDialogPropsType = UseDisconnectAppDialogReturnType;

export interface CodeSnippetPropsType {
  code: string;
  /** Accessible name of the copy button. */
  copyLabel: string;
  label?: string;
  /** Wraps long lines (keys, URLs) instead of scrolling. */
  wrap?: boolean;
}
