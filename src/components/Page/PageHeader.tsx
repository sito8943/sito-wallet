import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// icons
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// types
import { PageHeaderPropsType } from "./types";

// lib
import { BaseEntityDto } from "lib";

// components
import { Actions, ActionsDropdown } from "components";

// hooks
import { useScrollTrigger } from "hooks";

export const PageHeader = <TEntity extends BaseEntityDto>(
  props: PageHeaderPropsType<TEntity>
) => {
  const { showBackButton, title, actions } = props;

  const { t } = useTranslation();

  const navigate = useNavigate();

  const passedOffset = useScrollTrigger(100);

  return (
    <div className={`page-header ${passedOffset ? "fixed" : ""}`}>
      <div className="flex gap-2 items-center justify-start">
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            className="action"
            name={t("_accessibility:buttons.back")}
            data-tooltip-id="tooltip"
            data-tooltip-content={t("_accessibility:buttons.back")}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
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
