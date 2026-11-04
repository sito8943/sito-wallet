import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { CountBadgeIconPropsType } from "./types";
import { formatBadgeCount } from "./utils";

import "./styles.css";

/** Icon with a small count badge on its top-right corner. */
export function CountBadgeIcon(props: CountBadgeIconPropsType) {
  const { icon, count } = props;
  const label = formatBadgeCount(count);

  return (
    <span className="count-badge-icon">
      <FontAwesomeIcon icon={icon} />
      {label && (
        <span className="count-badge" aria-hidden="true">
          {label}
        </span>
      )}
    </span>
  );
}
