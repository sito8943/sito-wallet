import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { Button } from "@sito/dashboard-app";

// providers
import { useBottomNavAction } from "providers";

// views
import { bottomMap } from "../../views/bottomMap";

// types
import type { BottomNavItemType } from "../../views/types";

const NavLink = ({
  item,
  isActive,
}: {
  item: BottomNavItemType;
  isActive: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <Link
      to={item.path}
      className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-colors ${
        isActive ? "text-hover-primary" : "text-text-muted/60"
      }`}
      aria-label={t(`_pages:${item.page}.title`)}
    >
      <span className="text-lg">{item.icon}</span>
      <span className="text-[10px] leading-tight">
        {t(`_pages:${item.page}.title`)}
      </span>
    </Link>
  );
};

export const BottomNavigation = () => {
  const location = useLocation();
  const { onAdd } = useBottomNavAction();

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  const leftItems = useMemo(
    () => bottomMap.filter((item) => item.position === "left"),
    [],
  );

  const rightItems = useMemo(
    () => bottomMap.filter((item) => item.position === "right"),
    [],
  );

  return (
    <nav className="fixed -bottom-1 left-0 right-0 z-20 bg-base border-t border-border sm:hidden">
      <div className="flex items-center justify-around h-16">
        {leftItems.map((item) => (
          <NavLink
            key={item.path}
            item={item}
            isActive={isActive(item.path)}
          />
        ))}

        {onAdd ? (
          <div className="flex items-center justify-center flex-1">
            <Button
              variant="submit"
              color="primary"
              onClick={onAdd}
              className="!rounded-full !w-12 !h-12 !min-w-0 !p-0 flex items-center justify-center shadow-lg -mt-4"
              aria-label="Add"
            >
              <FontAwesomeIcon icon={faPlus} className="text-lg" />
            </Button>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {rightItems.map((item) => (
          <NavLink
            key={item.path}
            item={item}
            isActive={isActive(item.path)}
          />
        ))}
      </div>
    </nav>
  );
};
