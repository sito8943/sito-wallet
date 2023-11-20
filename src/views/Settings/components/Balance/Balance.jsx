import { memo } from "react";
import PropTypes from "prop-types";

// @emotion/cs
import { css } from "@emotion/css";

import {
  faArrowTrendUp,
  faArrowTrendDown,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

// @sito/ui
import { IconButton } from "@sito/ui";

// components
import DebouncedInput from "../../../../components/DebouncedInput/DebouncedInput";

function Balance({
  id,
  description,
  bill,
  created_at,
  onChangeDescription,
  onChangeBill,
  onDelete,
}) {
  return (
    <div id={id} className="flex w-full justify-between items-center py-2">
      <div className="flex flex-col justify-start items-start flex-1">
        <DebouncedInput
          className={`text-lg ${css({ background: "none" })}`}
          initialValue={description}
          onDebounceTrigger={onChangeDescription}
        />
        <p className="text-sm">
          {new Date(created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      <div className="font-bold flex items-center gap-5">
        <IconButton
          name="toggle-bill"
          tooltip="Alternar entre gasto e ingreo"
          aria-label="Alternar entre gasto e ingreo"
          onClick={() => onChangeBill()}
          icon={bill ? faArrowTrendDown : faArrowTrendUp}
        />
        <IconButton
          name="delete-balance"
          tooltip="Eliminar balance"
          aria-label="Eliminar balance"
          onClick={onDelete}
          icon={faTrash}
        />
      </div>
    </div>
  );
}

Balance.propTypes = {
  id: PropTypes.string,
  created_at: PropTypes.number,
  description: PropTypes.string,
  onChangeDescription: PropTypes.func,
  bill: PropTypes.bool,
  onChangeBill: PropTypes.func,
  onDelete: PropTypes.func,
};

const BalanceMemo = memo(
  (props) => <Balance {...props} />,
  (oldProps, newProps) => {
    return (
      oldProps.id === newProps.id &&
      oldProps.description === newProps.description &&
      oldProps.bill === newProps.bill &&
      oldProps.onChangeDescription === newProps.onChangeDescription &&
      oldProps.onChangeBill === newProps.onChangeBill &&
      oldProps.onDelete === newProps.onDelete
    );
  }
);

BalanceMemo.displayName = "Balance";

export default BalanceMemo;
