import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

// images
import noPhoto from "../../../assets/images/no-photo.webp";

function Navbar() {
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
      className={`${
        transparency
          ? "p-7"
          : "w-[90%] fixed top-3 left-[50%] -translate-x-[50%]"
      }`}
    >
      <div
        className={`flex w-full justify-between backdrop-blur-md p-3 rounded-[100px] ${
          transparency
            ? ""
            : "bg-light-background-opacity dark:bg-dark-background-opacity"
        } transition-all duration-300 ease-in-out`}
      >
        <Link to="/" className="flex gap-2 items-center">
          LOGO
          <h1 className="primary uppercase text-xl">Sito Wallet</h1>
        </Link>
        <nav>
          <Link to="/profile">
            <img
              src={noPhoto}
              alt="user-photo"
              className="rounded-full w-10 h-10 object-contain"
            />
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
