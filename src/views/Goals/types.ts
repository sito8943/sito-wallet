import type { FieldValues } from "react-hook-form";

import type {
  ActionType,
  TriggerFormDialogPropsType,
} from "@sito/dashboard-app";

import type {
  AddGoalDto,
  CommonAccountDto,
  CommonCurrencyDto,
  CommonProductDto,
  GoalDto,
  PhotoFormValues,
  UpdateGoalDto,
} from "lib";

export interface GoalFormType extends FieldValues, PhotoFormValues {
  id: number;
  name: string;
  description: string;
  product: CommonProductDto | null;
  account: CommonAccountDto | null;
  currency: CommonCurrencyDto | null;
  targetAmount: string;
  savedAmount: string;
  /** "YYYY-MM-DD" or "". */
  deadline: string;
  /** Whether the stored goal has its own photo (only that one can be removed). */
  hasOwnPhoto: boolean;
  /** Name last filled in from a product; a new product may replace it. */
  autoName: string;
}

export interface GoalFormPropsType extends TriggerFormDialogPropsType<GoalFormType> {
  /** Loaded goals, to warn when the account is already used by another active goal. */
  goals: GoalDto[];
}

export type AddGoalDialogPropsType = GoalFormPropsType;

export type EditGoalDialogPropsType = GoalFormPropsType;

export interface UseGoalDialogProps {
  goals: GoalDto[];
}

export interface CreateGoalMutationDto {
  payload: AddGoalDto;
  file: File | null;
}

export interface UpdateGoalMutationDto {
  payload: UpdateGoalDto;
  file: File | null;
  /** Delete the goal's own photo after saving. */
  removePhoto: boolean;
}

/** Fields the product selection may prefill. */
export type GoalProductPrefillValues = Pick<
  GoalFormType,
  "name" | "autoName" | "targetAmount" | "account" | "currency"
>;

export interface GoalCardPropsType extends GoalDto {
  actions: ActionType<GoalDto>[];
  onClick: (id: number) => void;
  swipeDeleteOpen?: boolean;
  onSwipeDelete?: () => void;
}

export type GoalStatusAction = "complete" | "cancel" | "reopen";

export interface GoalStatusMutationVariables {
  id: number;
  action: GoalStatusAction;
}

export enum GoalAction {
  Edit = "edit",
  Complete = "complete",
  Cancel = "cancel",
  Reopen = "reopen",
}

export interface UseGoalActionsProps {
  onEdit: (id: number) => void;
  onComplete: (id: number) => void;
  onCancel: (id: number) => void;
  onReopen: (id: number) => void;
  /** Disables the status actions while one is running. */
  busy?: boolean;
}
