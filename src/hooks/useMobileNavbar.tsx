import { useEffect, useRef } from "react";
import type { ComponentProps } from "react";
import { useNavbar, ActionsDropdown } from "@sito/dashboard-app";

type ActionsDropdownActions = ComponentProps<typeof ActionsDropdown>["actions"];
type ActionsDropdownAction = ActionsDropdownActions[number];

const getActionsSignature = (actions: ActionsDropdownActions | undefined) => {
  if (!actions?.length) return "";

  return actions
    .map(
      (action) =>
        `${action.id}|${action.tooltip}|${action.disabled ? "1" : "0"}|${
          action.hidden ? "1" : "0"
        }`
    )
    .join(";");
};

export function useMobileNavbar(title: string, actions?: ActionsDropdownActions) {
  const { setTitle, setRightContent } = useNavbar();
  const actionsRef = useRef<ActionsDropdownActions>(actions ?? []);
  const actionsSignatureRef = useRef("");

  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);

  useEffect(() => {
    actionsRef.current = actions ?? [];
  }, [actions]);

  useEffect(() => {
    const nextSignature = getActionsSignature(actionsRef.current);

    if (actionsSignatureRef.current === nextSignature) return;
    actionsSignatureRef.current = nextSignature;

    const proxiedActions = actionsRef.current.map((action, index) => {
      const proxiedAction: ActionsDropdownAction = {
        ...action,
        onClick: (entity) => {
          actionsRef.current[index]?.onClick(entity);
        },
      };

      return proxiedAction;
    });

    setRightContent(
      proxiedActions.length ? (
        <div className="xs:hidden">
          <ActionsDropdown actions={proxiedActions} />
        </div>
      ) : null
    );
  }, [actions, setRightContent]);

  useEffect(() => {
    return () => {
      setTitle("");
      setRightContent(null);
    };
  }, [setTitle, setRightContent]);
}
