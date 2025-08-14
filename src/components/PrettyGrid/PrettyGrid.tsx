// lib
import { BaseEntityDto } from "lib";

// types
import { PrettyGridPropsType } from "./types";

// component
import { Loading } from "components";

// styles
import "./styles.css";

export const PrettyGrid = <TDto extends BaseEntityDto>(
  props: PrettyGridPropsType<TDto>
) => {
  const {
    loading = false,
    emptyMessage = "",
    renderComponent,
    data = [],
  } = props;

  if (loading) {
    <Loading />;
  }

  return data?.length ? (
    <ul className="pretty-grid-main">
      {data?.map((item) => (
        <li className="pretty-grid-item" key={item.id}>
          {renderComponent(item)}
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-center mt-5">{emptyMessage}</p>
  );
};
