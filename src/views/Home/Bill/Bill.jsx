import { memo } from "react";
import PropTypes from "prop-types";

// @emotion/css
import { css } from "@emotion/css";

// components
import DebouncedInput from "../../../components/DebouncedInput/DebouncedInput";

function Bill({ description, spent, onChangeDescription, onChangeSpent }) {
  return (
    <div className="flex w-full justify-between items-center pr-[10px] py-2">
      <DebouncedInput
        className="text-lg flex-1"
        initialValue={description}
        onDebounceTrigger={onChangeDescription}
      />
      <div className="font-bold flex">
        $
        <DebouncedInput
          className={`text-right ml-1 ${css({ width: String(spent).length + "ch" })}`}
          initialValue={spent}
          type="number"
          onInput={(e) => (e.target.style.width = e.target.value.length + "ch")}
          onDebounceTrigger={onChangeSpent}
        />
      </div>
    </div>
  );
}

Bill.propTypes = {
  id: PropTypes.string,
  description: PropTypes.string,
  onChangeDescription: PropTypes.func,
  spent: PropTypes.number,
  onChangeSpent: PropTypes.func,
};

const BillMemo = memo(
  (props) => <Bill {...props} />,
  (oldProps, newProps) => {
    return (
      oldProps.id === newProps.id &&
      oldProps.description === newProps.description &&
      oldProps.spent === newProps.spent &&
      oldProps.onChangeDescription === newProps.onChangeDescription &&
      oldProps.onChangeSpent === newProps.onChangeSpent
    );
  }
);

BillMemo.displayName = "Bill";

export default BillMemo;
