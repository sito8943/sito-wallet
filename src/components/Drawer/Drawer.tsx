import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

//types
import { DrawerPropsTypes } from "./types.ts";

// styles
import "./styles.css";

// views
import { menuMap } from "views";

// providers
import { useAuth } from "providers";
import { useMemo } from "react";

export function Drawer(props: DrawerPropsTypes) {
  const { t } = useTranslation();

  const location = useLocation();

  const { open, onClose } = props;

  const { account } = useAuth();

  const parsedMenu = useMemo(() => {
    return menuMap.filter(
      (map) => map.auth === undefined || (map.auth && account.email)
    );
  }, [account.email]);

  return (
    <div
      aria-label={t("_accessibility:ariaLabels.closeMenu")}
      aria-disabled={!open}
      className={`${open ? "opened" : "closed"} drawer-backdrop`}
      onClick={() => onClose()}
    >
      <aside
        className={`${open ? "opened" : "closed"} bg-base drawer animated`}
      >
        <h2 className="text-xl text-text px-5 pb-5 font-bold poppins">
          {t("_pages:home.appName")}
        </h2>
        <ul className="flex flex-col">
          {parsedMenu.map((link, i) => (
            <li
              key={link.page ?? i}
              className={`w-full flex hover:bg-base-light ${
                link.path === location.pathname ? "bg-base-light" : ""
              } animated`}
            >
              {link.type !== "divider" ? (
                <Link
                  aria-disabled={!open}
                  to={link.path ?? `/${link.path}`}
                  aria-label={t(`_accessibility:ariaLabels.${link.path}`)}
                  className="text-lg text-text-muted w-full py-2 px-5 flex items-center justify-start gap-2"
                >
                  {link.icon}
                  {t(`_pages:${link.page}.title`)}
                </Link>
              ) : (
                <hr className="border-border border-spacing-x-0.5 w-full" />
              )}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
