import { memo } from "react";
import PropTypes from "prop-types";

// @emotion/css
import { css } from "@emotion/css";

// components
import DebouncedInput from "../../../components/DebouncedInput/DebouncedInput";
import { IconButton } from "@sito/ui";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function Bill({
  description,
  spent,
  onChangeDescription,
  onChangeSpent,
  onDelete,
}) {
  return (
    <div className="flex w-full justify-between items-center py-2">
      <DebouncedInput
        className="text-lg flex-1"
        initialValue={description}
        onDebounceTrigger={onChangeDescription}
      />
      <div className="font-bold flex items-center gap-5">
        <div className="flex items-center">
          $
          <DebouncedInput
            className={`text-right ml-1 ${css({
              width: String(spent).length + "ch",
            })}`}
            initialValue={spent}
            type="number"
            onInput={(e) =>
              (e.target.style.width = e.target.value.length + "ch")
            }
            onDebounceTrigger={onChangeSpent}
          />
        </div>
        <IconButton onClick={onDelete} icon={faTrash} />
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
  onDelete: PropTypes.func,
};

const BillMemo = memo(
  (props) => <Bill {...props} />,
  (oldProps, newProps) => {
    return (
      oldProps.id === newProps.id &&
      oldProps.description === newProps.description &&
      oldProps.spent === newProps.spent &&
      oldProps.onChangeDescription === newProps.onChangeDescription &&
      oldProps.onChangeSpent === newProps.onChangeSpent &&
      oldProps.onDelete === newProps.onDelete
    );
  }
);

BillMemo.displayName = "Bill";

export default BillMemo;
