import { memo } from "react";
import PropTypes from "prop-types";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

// @sito/ui
import { IconButton } from "@sito/ui";

// @emotion/css
import { css } from "@emotion/css";

// components
import DebouncedInput from "../../../../components/DebouncedInput/DebouncedInput";

function Bill({
  id,
  description,
  spent,
  created_at,
  onChangeDescription,
  onChangeSpent,
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
        <div className="flex items-center">
          $
          <DebouncedInput
            className={`text-right ml-1 ${css({
              width: String(spent).length + "ch",
              background: "none",
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
  created_at: PropTypes.number,
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
