import { Fragment } from "react";
import { Outlet } from "react-router-dom";

// @sito/ui
import { Handler } from "@sito/ui";

// components
import Navbar from "./Navbar/Navbar";

function View() {
  return (
    <Fragment>
      <Navbar />
      <Handler>
        <Outlet />
      </Handler>
    </Fragment>
  );
}

export default View;
