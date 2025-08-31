import { ButtonHTMLAttributes } from "react";
// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

// components
import { BaseCard } from "../BaseCard";

export const AddCard = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <BaseCard className="!p-0">
      <button {...props} className="w-full h-full">
        <FontAwesomeIcon icon={faAdd} />
      </button>
    </BaseCard>
  );
};
