import { useCallback, useMemo, useState } from "react";

import type {
  CalculatorLineKindType,
  CalculatorLinePatchType,
  CalculatorStateType,
  UseTypeResumeCalculatorPropsType,
} from "./types";
import {
  clampMonths,
  createCalculatorLine,
  getCalculatorStorageKey,
  readCalculatorDraft,
  resolveCalculatorState,
  writeCalculatorDraft,
} from "./utils";

/**
 * Calculator state: follows the card prefill until the first edit, then
 * keeps a local draft (this browser only) until reset.
 */
export function useTypeResumeCalculator(
  props: UseTypeResumeCalculatorPropsType,
) {
  const { cardId, prefill } = props;
  const storageKey = getCalculatorStorageKey(cardId);
  const [draft, setDraft] = useState<CalculatorStateType | null>(() =>
    readCalculatorDraft(storageKey),
  );

  const value = useMemo(
    () => resolveCalculatorState(draft, prefill),
    [draft, prefill],
  );

  const update = useCallback(
    (updater: (current: CalculatorStateType) => CalculatorStateType) =>
      setDraft((current) => {
        const next = updater(current ?? { ...prefill, startBalance: null });
        writeCalculatorDraft(storageKey, next);
        return next;
      }),
    [prefill, storageKey],
  );

  const setStartBalance = useCallback(
    (startBalance: string) =>
      update((current) => ({ ...current, startBalance })),
    [update],
  );

  const setMonths = useCallback(
    (months: string) =>
      update((current) => ({
        ...current,
        months: clampMonths(months),
        oneOff: current.oneOff.map((line) => ({
          ...line,
          month: Math.min(line.month, clampMonths(months)),
        })),
      })),
    [update],
  );

  const addLine = useCallback(
    (kind: CalculatorLineKindType) =>
      update((current) => ({
        ...current,
        [kind]: [...current[kind], createCalculatorLine()],
      })),
    [update],
  );

  const updateLine = useCallback(
    (
      kind: CalculatorLineKindType,
      id: string,
      patch: CalculatorLinePatchType,
    ) =>
      update((current) => ({
        ...current,
        [kind]: current[kind].map((line) =>
          line.id === id ? { ...line, ...patch } : line,
        ),
      })),
    [update],
  );

  const removeLine = useCallback(
    (kind: CalculatorLineKindType, id: string) =>
      update((current) => ({
        ...current,
        [kind]: current[kind].filter((line) => line.id !== id),
      })),
    [update],
  );

  const reset = useCallback(() => {
    writeCalculatorDraft(storageKey, null);
    setDraft(null);
  }, [storageKey]);

  return {
    value,
    /** Typed start balance, or null while following the account balance */
    startBalanceInput: draft?.startBalance ?? null,
    hasDraft: draft !== null,
    setStartBalance,
    setMonths,
    addLine,
    updateLine,
    removeLine,
    reset,
  };
}
