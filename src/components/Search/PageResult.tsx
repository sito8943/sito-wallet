import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";

// types
import type { PageResultPropsType } from "./types";

import "./styles.css";

/**
 *
 * @param {object} props component props
 * @returns PageResult
 */
const PageResult = (props: PageResultPropsType) => {
  const { onClick, path, name, time } = props;
  const { t } = useTranslation();

  return (
    <Link
      className="search-page-result group"
      to={path}
      onClick={onClick}
      data-search-focusable="true"
    >
      <FontAwesomeIcon className="search-page-result-icon" icon={faLink} />
      <p className="search-page-result-label">
        {name}{" "}
        <span className="search-page-result-type">
          ({t("_pages:search.types.page")})
        </span>
      </p>
      <span className="search-page-result-time">{time}</span>
    </Link>
  );
};

export default PageResult;
