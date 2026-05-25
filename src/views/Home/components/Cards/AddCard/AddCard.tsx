import type { ButtonHTMLAttributes } from "react";
// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

// components
import { BaseCard } from "../BaseCard";

import "../styles.css";

export const AddCard = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <BaseCard className="base-card--add">
      <button {...props} className="base-card-button">
        <FontAwesomeIcon icon={faAdd} />
      </button>
    </BaseCard>
  );
};
