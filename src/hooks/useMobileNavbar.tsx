import { useEffect } from "react";
import type { ComponentProps } from "react";
import { useNavbar, ActionsDropdown } from "@sito/dashboard-app";

type ActionsDropdownActions = ComponentProps<typeof ActionsDropdown>["actions"];

export function useMobileNavbar(title: string, actions?: unknown[]) {
  const { setTitle, setRightContent } = useNavbar();

  useEffect(() => {
    setTitle(title);
    setRightContent(
      actions?.length ? (
        <div className="xs:hidden">
          <ActionsDropdown actions={actions as ActionsDropdownActions} />
        </div>
      ) : null
    );
    return () => {
      setTitle("");
      setRightContent(null);
    };
  }, [title, actions, setTitle, setRightContent]);
}
