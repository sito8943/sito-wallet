import { useEffect, useRef } from "react";
import { useNavbar, ActionsDropdown, Actions } from "@sito/dashboard-app";
import type { BaseDto } from "@sito/dashboard-app";
import type { ActionsDropdownAction, ActionsDropdownActions } from "./types";
import { MOBILE_NAVBAR_MEDIA_QUERY } from "./mobileNavbar.constants";
import { getActionsSignature } from "./mobileNavbar.utils";

export function useMobileNavbar<TRow extends BaseDto>(
  title: string,
  actions?: ActionsDropdownActions<TRow>,
) {
  const { setTitle, setRightContent } = useNavbar();
  const actionsRef = useRef<ActionsDropdownActions<TRow>>(actions ?? []);
  const actionsSignatureRef = useRef("");

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }

    const mediaQuery = window.matchMedia(MOBILE_NAVBAR_MEDIA_QUERY);

    const syncTitle = (matches: boolean) => {
      setTitle(matches ? title : "");
    };

    syncTitle(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      syncTitle(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
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
        onClick: (entity: TRow | undefined) => {
          actionsRef.current[index]?.onClick(entity);
        },
      };

      return proxiedAction;
    });

    setRightContent(
      proxiedActions.length ? (
        <>
          <div className="max-xs:hidden sm:hidden">
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
