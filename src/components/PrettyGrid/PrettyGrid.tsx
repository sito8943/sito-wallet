// lib
import { BaseEntityDto } from "lib";

// types
import { PrettyGridPropsType } from "./types";

export const PrettyGrid = <TDto extends BaseEntityDto>(
  props: PrettyGridPropsType<TDto>
) => {
  const { emptyMessage = "", renderComponent, data = [] } = props;

  return data?.length ? (
    <ul className="flex flex-wrap max-xs:flex-col gap-3">
      {data?.map((item) => <li key={item.id}>{renderComponent(item)}</li>)}
    </ul>
  ) : (
    <p className="text-center mt-5">{emptyMessage}</p>
  );
};
