// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

// components
import { BaseCard } from "../BaseCard";

export const AddCard = () => {
  return (
    <BaseCard>
      <button>
        <FontAwesomeIcon icon={faAdd} />
      </button>
    </BaseCard>
  );
};
