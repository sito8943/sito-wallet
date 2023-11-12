import { Link } from "react-router-dom";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSadTear } from "@fortawesome/free-regular-svg-icons";

function NotFound() {
  return (
    <main className="w-full h-screen flex items-center justify-center flex-col gap-5">
      <FontAwesomeIcon
        icon={faSadTear}
        className="dark:text-white text-7xl appear"
      />
      <h2 className="dark:text-white text-center appear">
        404 - Página no encontrada
      </h2>
      <Link
        name="go-home"
        aria-label="click para ir al inicio"
        to="/"
        className="secondary button submit appear"
      >
        Ir al inicio
      </Link>
    </main>
  );
}

export default NotFound;
