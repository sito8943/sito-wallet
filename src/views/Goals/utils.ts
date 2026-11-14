import type { CommonProductDto, GoalDto } from "lib";
import {
  GoalStatus,
  getGoalProductName,
  parseNullableNumber,
  photoToFormValues,
} from "lib";

import type {
  CreateGoalMutationDto,
  GoalFormType,
  GoalProductPrefillValues,
  UpdateGoalMutationDto,
} from "./types";

export const emptyGoalForm: GoalFormType = {
  id: 0,
  name: "",
  description: "",
  product: null,
  account: null,
  currency: null,
  targetAmount: "",
  savedAmount: "",
  deadline: "",
  hasOwnPhoto: false,
  autoName: "",
  ...photoToFormValues(),
};

const amountToForm = (value: number | null | undefined): string =>
  value === null || value === undefined ? "" : String(value);

export const goalDtoToForm = (dto: GoalDto): GoalFormType => ({
  id: dto.id,
  name: dto.name,
  description: dto.description ?? "",
  product: dto.product,
  account: dto.account,
  currency: dto.currency,
  targetAmount: amountToForm(dto.targetAmount),
  savedAmount: dto.account ? "" : amountToForm(dto.savedAmount),
  deadline: dto.deadline ?? "",
  hasOwnPhoto: dto.hasOwnPhoto,
  autoName:
    dto.product && dto.name === getGoalProductName(dto.product) ? dto.name : "",
  // Only the goal's own photo is editable; the product's is a fallback.
  ...photoToFormValues(dto.hasOwnPhoto ? dto.photo : null),
});

export const goalFormToAddDto = (form: GoalFormType): CreateGoalMutationDto => {
  const linkedAccount = form.account;
  const currencyId = linkedAccount?.currency?.id ?? form.currency?.id ?? 0;

  return {
    payload: {
      name: form.name.trim(),
      description: form.description.trim() || null,
      productId: form.product?.id ?? null,
      accountId: linkedAccount?.id ?? null,
      currencyId,
      targetAmount: parseNullableNumber(form.targetAmount) ?? 0,
      // With an account the saved amount is its balance.
      savedAmount: linkedAccount
        ? null
        : (parseNullableNumber(form.savedAmount) ?? 0),
      deadline: form.deadline || null,
    },
    file: form.file ?? null,
  };
};

export const goalFormToUpdateDto = (
  form: GoalFormType,
): UpdateGoalMutationDto => ({
  payload: { id: form.id, ...goalFormToAddDto(form).payload },
  file: form.file ?? null,
  removePhoto: !form.file && form.removePhoto && form.hasOwnPhoto,
});

/**
 * What picking `product` fills in: the name when empty or still the one
 * filled from the previous product, the target with its last unit price when
 * empty, and that price's currency when no account sets it.
 */
export const getProductPrefill = (
  values: GoalProductPrefillValues,
  product: CommonProductDto | null,
): Partial<GoalProductPrefillValues> => {
  if (!product) return {};

  const patch: Partial<GoalProductPrefillValues> = {};
  const currentName = values.name.trim();
  if (!currentName || currentName === values.autoName) {
    const name = getGoalProductName(product);
    patch.name = name;
    patch.autoName = name;
  }

  const lastUnitPrice = product.lastUnitPrice;
  if (
    !values.targetAmount.trim() &&
    lastUnitPrice !== null &&
    lastUnitPrice !== undefined
  ) {
    patch.targetAmount = String(lastUnitPrice);
    if (!values.account && product.lastUnitPriceCurrency) {
      patch.currency = product.lastUnitPriceCurrency;
    }
  }

  return patch;
};

/** Another active (not deleted) goal already tracks this account. */
export const isAccountUsedByOtherActiveGoal = (
  goals: GoalDto[],
  accountId: number | null | undefined,
  goalId: number,
): boolean => {
  if (!accountId) return false;

  return goals.some(
    (goal) =>
      goal.id !== goalId &&
      !goal.deletedAt &&
      goal.status === GoalStatus.Active &&
      goal.account?.id === accountId,
  );
};
