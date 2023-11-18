import { memo } from "react";
import PropTypes from "prop-types";

function Bill({ description, spent, onChangeDescription, onChangeSpent }) {
  return (
    <div className="flex w-full justify-between items-center pr-4 py-2">
      <p className="text-xl flex-1" contentEditable onInput={onChangeDescription}>
        {description}
      </p>
      <p className="font-bold" contentEditable onInput={onChangeSpent}>
        $ {spent}
      </p>
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
