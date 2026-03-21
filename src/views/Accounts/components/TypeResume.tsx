import { TransactionType } from "lib";
import { Type } from "views/TransactionCategories";
import { TypeResumePropsType } from "./types";

const TypeResume = (props: TypeResumePropsType) => {
  const { accountId, currency } = props;

  return (
    <div className="w-full mt-4">
      <hr className="border-border rounded-full border-1 mb-2" />
      <div>
        <div>
          <h4></h4>
          <p></p>
          <Type type={TransactionType.In} noText filled={false} />
        </div>
        <div>
          <h4></h4>
          <p></p>
          <Type type={TransactionType.Out} noText filled={false} />
        </div>
      </div>
    </div>
  );
};

export default TypeResume;
