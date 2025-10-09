import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";

// types
import { PageResultPropsType } from "./types";

/**
 *
 * @param {object} props component props
 * @returns PageResult
 */
const PageResult = (props:PageResultPropsType) => {
  const { onClick, path, name, time } = props;
  const { t } = useTranslation();

  return (
    <Link
      className="flex gap-2 items-center p-2 text-slate-800 hover:text-white hover:bg-primary rounded group"
      to={path}
      onClick={onClick}
    >
      <FontAwesomeIcon
        className="text-slate-400 dark:text-slate-500 group-hover:text-white group-hover:text-opacity-50"
        icon={faLink}
      />
      <p>
        {name} <span className="text-xs">({t("_pages:search.types.page")})</span>
      </p>
      <span className="text-xs flex-1 text-end text-slate-400 dark:text-slate-500 group-hover:text-white group-hover:text-opacity-50">
        {time}
      </span>
    </Link>
  );
};

export default PageResult;