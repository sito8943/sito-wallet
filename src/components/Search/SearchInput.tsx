import { forwardRef } from "react";
import { useTranslation } from "react-i18next";

// icons
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// @sito/dashboard
import { TextInput } from "@sito/dashboard";

// types
import { SearchInputPropsType } from "./types";

export const SearchInput = forwardRef<HTMLInputElement, SearchInputPropsType>(
  (props, ref) => {
    const { t } = useTranslation();
    const { searching, setSearching, onClick } = props;

    return (
      <div>
        <TextInput
          ref={ref}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          value={searching}
          placeholder={t("_pages:search.placeholder")}
          onChange={(e) => setSearching((e.target as HTMLInputElement).value)}
          inputClassName="!pl-9"
        >
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute top-3.5 left-3.5"
          />
        </TextInput>
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
