// lib
import { TransactionType } from "lib";

// hooks
import { useTransactionsGroupedByType } from "hooks";

// component
import { Type } from "views/TransactionCategories";
import { Money } from "components";

// types
import type { TypeResumePropsType } from "./types";

// styles
import "./styles.css";

const TypeResume = (props: TypeResumePropsType) => {
  const { accountId, currency } = props;
  const { data, isLoading } = useTransactionsGroupedByType({
    accountId,
  });

  const incomeTotal = data?.incomeTotal ?? 0;
  const expenseTotal = data?.expenseTotal ?? 0;

  return (
    <div className="type-group-wrapper">
      <div className="type-group-grid">
        <div className="type-group">
          <div className="type-group-value-row">
            <Type type={TransactionType.In} noText filled={false} />
            <p className="type-group-value--income">
              <Money
                amount={incomeTotal}
                currency={currency}
                loading={isLoading}
              />
            </p>
          </div>
        </div>
        <div className="type-group">
          <div className="type-group-value-row">
            <Type type={TransactionType.Out} noText filled={false} />
            <p className="type-group-value--expense">
              <Money
                amount={expenseTotal}
                currency={currency}
                loading={isLoading}
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypeResume;
