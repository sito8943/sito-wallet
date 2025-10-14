import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// @sito/dashboard-app
import { useScrollTrigger } from "@sito/dashboard-app";

// icons
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

// types
import { PageHeaderPropsType } from "./types";

// lib
import { BaseEntityDto } from "@sito/dashboard-app";

// components
import { Actions, ActionsDropdown, IconButton } from "components";

export const PageHeader = <TEntity extends BaseEntityDto>(
  props: PageHeaderPropsType<TEntity>
) => {
  const { showBackButton, title, actions } = props;

  const { t } = useTranslation();

  const navigate = useNavigate();

  const passedOffset = useScrollTrigger(200);

  return (
    <div className={`page-header ${passedOffset ? "fixed" : ""}`}>
      <div className="flex gap-2 items-center justify-start">
        {showBackButton && (
          <IconButton
            icon={faArrowLeft}
            onClick={() => navigate(-1)}
            name={t("_accessibility:buttons.back")}
            data-tooltip-id="tooltip"
            data-tooltip-content={t("_accessibility:buttons.back")}
          />
        )}
        <h2 className="text-3xl font-bold">{title}</h2>
      </div>
      <div>
        <Actions className="max-xs:!hidden" actions={actions ?? []} />
        <ActionsDropdown className="min-xs:hidden" actions={actions ?? []} />
      </div>
    </div>
  );
};
