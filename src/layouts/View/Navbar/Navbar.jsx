import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  faArrowRightFromBracket,
  faGear,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";

// @sito/ui
import { IconButton, useMode } from "@sito/ui";

// providers
import { useUser } from "../../../providers/UserProvider";

// images
import noPhoto from "../../../assets/images/no-photo.webp";

// styles
import "./styles.css";

function Navbar() {
  const { userState } = useUser();
  const { toggleMode, mode } = useMode();

  const [transparency, setTransparency] = useState(true);

  const onScroll = useCallback(() => {
    const top = window.pageYOffset || document.documentElement.scrollTop;
    if (top > 10) setTransparency(false);
    else setTransparency(true);
  }, [setTransparency]);

  useEffect(() => {
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  return (
    <header
      className={`z-50 fixed top-3 left-[50%] -translate-x-[50%] transition-all duration-300 ease-in-out ${
        transparency ? "w-[99%]" : "navbar"
      }`}
    >
      <div
        className={`relative backdrop-blur-[1rem] rounded-[100px] flex w-full justify-between py-3 px-5 xs:px-3 `}
      >
        <div
          className={` absolute w-full h-full top-0 left-0 rounded-[100px] opacity-90 ${
            transparency ? "" : "blur-background"
          }`}
        ></div>
        <Link
          aria-label="Ir al inicio"
          name="go-home"
          to="/"
          className="z-10 flex gap-2 items-center primary"
        >
          <img
            src={noPhoto}
            alt="user-photo"
            className="rounded-full w-10 h-10 object-contain"
          />
          <h1 className="capitalize text-xl">
            {userState.user?.email?.split("@")[0]}
          </h1>
        </Link>
        <nav className="z-10 flex">
          <IconButton
            onClick={() => toggleMode()}
            tooltip="Alternar tema (Claro/Oscuro)"
            name="toggle-theme"
            aria-label="Click para cambiar el tema"
            icon={mode === "dark" ? faSun : faMoon}
          />{" "}
          <Link
            to="/settings"
            name="toggle-theme"
            aria-label="Ir a la configuración"
          >
            <IconButton
              tooltip="Ir a la configuración"
              name="toggle-theme"
              aria-label="Ir a la configuración"
              icon={faGear}
            />
          </Link>
          <Link to="/sign-out" name="logout" aria-label="Cerrar sesión">
            <IconButton
              tooltip="Cerrar sesión"
              name="logout"
              aria-label="Cerrar sesión"
              icon={faArrowRightFromBracket}
            />
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
