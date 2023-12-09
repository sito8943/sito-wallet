import React from "react";

// @sito/ui
import { Loading } from "@sito/ui";

function Syncing() {
  return (
    <Loading
      className="sync rounded-full !bg-[#00000000]"
      strokeWidth="6"
      color="basics"
    />
  );
}

export default Syncing;
