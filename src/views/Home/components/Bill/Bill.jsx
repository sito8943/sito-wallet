import { memo, useMemo } from "react";
import PropTypes from "prop-types";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

// @sito/ui
import { IconButton } from "@sito/ui";

// @emotion/css
import { css } from "@emotion/css";

// components
import DebouncedInput from "../../../../components/DebouncedInput/DebouncedInput";

// providers
import { useUser } from "../../../../providers/UserProvider";

function Balance({
  id,
  walletBalances,
  description,
  spent,
  created_at,
  balanceType,
  onChangeBalanceType,
  onChangeDescription,
  onChangeSpent,
  onDelete,
}) {
  const { userState } = useUser();

  const nameCss = useMemo(
    () =>
      css({
        background: "none",
        maxWidth: "calc(100vw - 92px)",
      }),
    []
  );
  const spentCss = useMemo(
    () =>
      css({
        maxWidth: "100px",
        width: String(spent).length + "ch",
        background: "none",
      }),
    [spent]
  );

  return (
    <div id={id} className="flex w-full justify-between items-center py-2">
      <div className="flex flex-col justify-start items-start flex-1">
        <DebouncedInput
          className={`text-lg xs:text-base w-full ${nameCss}`}
          initialValue={description}
          onDebounceTrigger={onChangeDescription}
        />
        <div className="flex gap-2 items-center">
          <p className={`text-sm xs:text-xs`}>
            {new Date(created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <select
            value={balanceType}
            onChange={(e) => onChangeBalanceType(e.target.value)}
            className={`text-sm no-bg`}
          >
            {userState.balances?.map((balance) => (
              <option key={balance.id} value={balance.id}>
                {balance.description}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="font-bold flex items-center gap-5">
        <div
          className={`flex items-center ${
            walletBalances.bill ? "error" : "success"
          }`}
        >
          <p className="text-right xs:text-sm">
            {walletBalances.bill ? "-" : "+"} $
          </p>
          <DebouncedInput
            className={`text-right xs:text-sm ml-1 xs:ml-0 ${spentCss}`}
            initialValue={spent}
            type="number"
            onInput={(e) =>
              (e.target.style.width = e.target.value.length + "ch")
            }
            onDebounceTrigger={onChangeSpent}
          />
        </div>
        <IconButton
          tooltip="Eliminar balance"
          aria-label="Eliminar balance"
          name="delete-balance"
          onClick={onDelete}
          icon={faTrash}
        />
      </div>
    </div>
  );
}

Balance.propTypes = {
  id: PropTypes.string,
  walletBalances: PropTypes.object,
  created_at: PropTypes.number,
  balanceType: PropTypes.string,
  description: PropTypes.string,

  spent: PropTypes.number,
  onChangeBalanceType: PropTypes.func,
  onChangeDescription: PropTypes.func,
  onChangeSpent: PropTypes.func,
  onDelete: PropTypes.func,
};

const BalanceMemo = memo(
  (props) => <Balance {...props} />,
  (oldProps, newProps) => {
    return (
      oldProps.id === newProps.id &&
      oldProps.balanceType === newProps.balanceType &&
      oldProps.description === newProps.description &&
      oldProps.spent === newProps.spent &&
      oldProps.onChangeBalanceType === newProps.onChangeBalanceType &&
      oldProps.onChangeDescription === newProps.onChangeDescription &&
      oldProps.onChangeSpent === newProps.onChangeSpent &&
      oldProps.onDelete === newProps.onDelete
    );
  }
);

BalanceMemo.displayName = "Balance";

export default BalanceMemo;
