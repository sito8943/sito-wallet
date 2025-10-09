// icons
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// @sito/dashboard
import { TextInput } from "@sito/dashboard";

// types
import { SearchInputPropsType } from "./types";

export const SearchInput = (props: SearchInputPropsType) => {
  const { searching, setSearching, onClick } = props;

  return (
    <div>
      <TextInput
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        value={searching}
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
};
