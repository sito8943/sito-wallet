import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

//types
import { DrawerPropsTypes } from "./types.ts";

// styles
import "./styles.css";

// views
import { menuMap } from "views";

export function Drawer(props: DrawerPropsTypes) {
  const { t } = useTranslation();

  const location = useLocation();

  const { open, onClose } = props;

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
          {menuMap.map((link) => (
            <li
              key={link.page}
              className={`w-full flex hover:bg-base-light ${
                link.path === location.pathname ? "bg-base-light" : ""
              } animated`}
            >
              <Link
                aria-disabled={!open}
                to={link.path ?? `/${link.path}`}
                aria-label={t(`_accessibility:ariaLabels.${link.path}`)}
                className="text-lg text-text-muted flex w-full py-2 px-5"
              >
                {t(`_pages:${link.page}.title`)}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
