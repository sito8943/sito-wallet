import { useEffect, useRef } from "react";
import { useNavbar, ActionsDropdown, Actions } from "@sito/dashboard-app";
import type { ActionPropsType, BaseDto } from "@sito/dashboard";

type ActionsDropdownActions<TRow extends BaseDto> = ActionPropsType<TRow>[];
type ActionsDropdownAction<TRow extends BaseDto> =
  ActionsDropdownActions<TRow>[number];

const getActionsSignature = <TRow extends BaseDto>(
  actions: ActionsDropdownActions<TRow> | undefined,
) => {
  if (!actions?.length) return "";

  return actions
    .map(
      (action) =>
        `${action.id}|${action.tooltip}|${action.disabled ? "1" : "0"}|${
          action.hidden ? "1" : "0"
        }`,
    )
    .join(";");
};

export function useMobileNavbar<TRow extends BaseDto>(
  title: string,
  actions?: ActionsDropdownActions<TRow>,
) {
  const { setTitle, setRightContent } = useNavbar();
  const actionsRef = useRef<ActionsDropdownActions<TRow>>(actions ?? []);
  const actionsSignatureRef = useRef("");

  useEffect(() => {
    setTitle(title);
  }, [setTitle, title]);

  useEffect(() => {
    actionsRef.current = actions ?? [];
  }, [actions]);

  useEffect(() => {
    const nextSignature = getActionsSignature(actionsRef.current);

    if (actionsSignatureRef.current === nextSignature) return;
    actionsSignatureRef.current = nextSignature;

    const proxiedActions = actionsRef.current.map((action, index) => {
      const proxiedAction: ActionsDropdownAction<TRow> = {
        ...action,
        onClick: (entity) => {
          actionsRef.current[index]?.onClick(entity);
        },
      };

      return proxiedAction;
    });

    setRightContent(
      proxiedActions.length ? (
        <>
          <div className="max-xs:hidden">
            <Actions actions={proxiedActions} />
          </div>
          <div className="xs:hidden">
            <ActionsDropdown actions={proxiedActions} />
          </div>
        </>
      ) : null,
    );
  }, [actions, setRightContent]);

  useEffect(() => {
    return () => {
      setTitle("");
      setRightContent(null);
    };
  }, [setTitle, setRightContent]);
}
