import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faMoneyBillTransfer } from "@fortawesome/free-solid-svg-icons";

// types
import type { PageResultPropsType } from "./types";

import "./styles.css";

/**
 *
 * @param {object} props component props
 * @returns PageResult
 */
const PageResult = (props: PageResultPropsType) => {
  const { onClick, path, name, time, type = "page", detail } = props;
  const { t } = useTranslation();

  return (
    <Link
      className="search-page-result group"
      to={path}
      onClick={onClick}
      data-search-focusable="true"
    >
      <FontAwesomeIcon
        className="search-page-result-icon"
        icon={type === "entity" ? faMoneyBillTransfer : faLink}
      />
      <p className="search-page-result-label">
        {name}{" "}
        <span className="search-page-result-type">
          (
          {t(
            type === "entity"
              ? "_entities:entities.transaction.singular"
              : "_pages:search.types.page",
          )}
          )
        </span>
        {detail && <span className="block text-xs opacity-70">{detail}</span>}
      </p>
      <span className="search-page-result-time">{time}</span>
    </Link>
  );
};

export default PageResult;
