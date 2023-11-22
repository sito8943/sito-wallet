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
import { useMemo } from "react";

function Balance({
  id,
  description,
  bill,
  onChangeDescription,
  onChangeBill,
  onDelete,
}) {
  const descriptionCss = useMemo(
    () =>
      css({
        maxWidth: "calc(100vw - 92px)",
      }),
    []
  );

  return (
    <div id={id} className="flex w-full justify-between items-center py-2">
      <DebouncedInput
        className={`text-lg no-bg ${descriptionCss} flex-1`}
        initialValue={description}
        onDebounceTrigger={onChangeDescription}
      />
      <div className="font-bold flex items-center gap-3">
        <IconButton
          name="toggle-bill"
          tooltip="Alternar entre gasto e ingreo"
          aria-label="Alternar entre gasto e ingreo"
          onClick={() => onChangeBill()}
          className={`${!bill ? "secondary" : "primary"}`}
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
