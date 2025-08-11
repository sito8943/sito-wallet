import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextInput } from "@sito/dashboard";
import { useState } from "react";

export const SearchWrapper = () => {
  const [searching, setSearching] = useState("");

  return (
    <div>
      <TextInput
        value={searching}
        onChange={(e) => setSearching((e.target as HTMLInputElement).value)}
        inputClassName="!pl-9"
      >
        <FontAwesomeIcon icon={faSearch} className="absolute top-3.5 left-3.5" />
      </TextInput>
    </div>
  );
};
