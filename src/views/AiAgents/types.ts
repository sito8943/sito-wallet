import type { FieldValues } from "react-hook-form";

// @sito/dashboard-app
import type {
  ConfirmationDialogPropsType,
  TriggerFormDialogPropsType,
  UseFormDialogReturnType,
} from "@sito/dashboard-app";

// lib
import type { ApiKeyDto, CreatedApiKeyDto } from "lib";

export interface CreateApiKeyFormType extends FieldValues {
  name: string;
}

export type CreateApiKeyDialogPropsType =
  TriggerFormDialogPropsType<CreateApiKeyFormType>;

export interface UseCreateApiKeyDialogReturnType extends UseFormDialogReturnType<CreateApiKeyFormType> {
  /** Key just created (full secret), shown once and then discarded. */
  createdKey: CreatedApiKeyDto | null;
  clearCreatedKey: () => void;
}

export interface UseRevokeApiKeyDialogReturnType extends ConfirmationDialogPropsType {
  target: ApiKeyDto | null;
  openForKey: (apiKey: ApiKeyDto) => void;
}

export type RevokeApiKeyDialogPropsType = UseRevokeApiKeyDialogReturnType;

export interface CreatedApiKeyDialogPropsType {
  createdKey: CreatedApiKeyDto | null;
  mcpUrl: string;
  handleClose: () => void;
}

export interface ApiKeyListItemPropsType {
  apiKey: ApiKeyDto;
  onRevoke: (apiKey: ApiKeyDto) => void;
  disabled?: boolean;
}

export interface ApiKeysSectionPropsType {
  apiKeys: ApiKeyDto[];
  isLoading: boolean;
  hasError: boolean;
  onRetry: () => void;
  onCreate: () => void;
  onRevoke: (apiKey: ApiKeyDto) => void;
}

export interface McpSetupInstructionsPropsType {
  mcpUrl: string;
  /** Full key to fill in the snippets; the placeholder is used without it. */
  apiKey?: string | null;
}

export interface CodeSnippetPropsType {
  code: string;
  /** Accessible name of the copy button. */
  copyLabel: string;
  label?: string;
  /** Wraps long lines (keys, URLs) instead of scrolling. */
  wrap?: boolean;
}
