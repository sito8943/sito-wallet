import { useTranslation } from "react-i18next";

// lib
import { BaseEntityDto } from "@sito/dashboard-app";

// types
import { PrettyGridPropsType } from "./types";

// component
import { Loading } from "components";

// styles
import "./styles.css";

export const PrettyGrid = <TDto extends BaseEntityDto>(
  props: PrettyGridPropsType<TDto>
) => {
  const { t } = useTranslation();

  const {
    loading = false,
    emptyComponent = null,
    emptyMessage = t("_accessibility:messages.empty"),
    renderComponent,
    data = [],
  } = props;

  if (loading) {
    <Loading />;
  }

  return (
    <>
      {data?.length ? (
        <ul className="pretty-grid-main">
          {data?.map((item) => (
            <li className="pretty-grid-item" key={item.id}>
              {renderComponent(item)}
            </li>
          ))}
        </ul>
      ) : (
        <>
          {emptyComponent ? (
            emptyComponent
          ) : (
            <p className="text-center mt-5">{emptyMessage}</p>
          )}
        </>
      )}
    </>
  );
};
