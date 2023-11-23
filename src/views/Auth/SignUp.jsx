import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// @sito/ui
import {
  useNotification,
  InputControl,
  IconButton,
  Button,
  Loading,
} from "@sito/ui";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faLockOpen,
} from "@fortawesome/free-solid-svg-icons";

// contexts
import { useUser } from "../../providers/UserProvider";

// components
import ModeButton from "../../components/ModeButton/ModeButton";

// services
import { register } from "../../services/auth";
import { createSettingsUser } from "../../services/user";

// auth
import { saveUser } from "../../utils/auth";

// images
// import logo from "../../assets/images/logo.png";

// lang
import { showError } from "../../lang/es";

// styles
import "./styles.css";

function SignUp() {
  const { setNotification } = useNotification();

  const [email, setEmail] = useState("");
  const [emailHelperText, setEmailHelperText] = useState("");

  const handleEmail = (e) => setEmail(e.target.value);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordHelperText, setPasswordHelperText] = useState("");

  const handlePassword = (e) => setPassword(e.target.value);

  const toggleShowPassword = () => setShowPassword((oldValue) => !oldValue);

  const [rPassword, setRPassword] = useState("");
  const [showRPassword, setShowRPassword] = useState(false);

  const handleRPassword = (e) => setRPassword(e.target.value);

  const toggleShowRPassword = () => setShowRPassword((oldValue) => !oldValue);

  const navigate = useNavigate();

  const { setUserState } = useUser();

  const [loading, setLoading] = useState(false);
  const [goToVerify, setGoToVerify] = useState(false);

  const onSubmit = useCallback(
    async (e) => {
      setEmailHelperText("");
      setPasswordHelperText("");
      e.preventDefault();
      if (!email.length) {
        document.getElementById("email")?.focus();
        setEmailHelperText("Debes introducir un email");
        return;
      }
      if (!password.length) {
        document.getElementById("password")?.focus();
        setPasswordHelperText("Debes introducir tu contraseña");
        return;
      }
      if (password !== rPassword) {
        document.getElementById("password")?.focus();
        setPasswordHelperText("No coinciden las contraseñas");
        return;
      }
      setLoading(true);
      const response = await register(email, password);
      const { data, error } = response;
      if (!error || error === null) {
        const settingUser = await createSettingsUser(data.user.id);
        if (settingUser.error && settingUser.user !== null) {
          console.error(settingUser.error.message);
          setGoToVerify(true);
        } else {
          setUserState({
            type: "logged-in",
            user: {
              ...data.user,
            },
            photo: {},
          });
          saveUser({ user: data.user, photo: {} });
          navigate("/");
        }
      } else
        setNotification({ type: "error", message: showError(error.message) });
      setLoading(false);
    },
    [email, password, rPassword, setNotification, navigate, setUserState]
  );

  return (
    <main className="w-full viewport flex items-center justify-center">
      <ModeButton className="top-1 right-1 icon-button primary" />
      <div
        className={`bg-light-alter dark:bg-dark-alter pointer-events-none fixed top-0 left-0 z-10 w-full h-screen flex items-center backdrop-blur-[1rem] transition-all duration-100 ${
          !loading ? "opacity-100" : "opacity-0"
        }`}
      >
        <Loading
          className={`dark:bg-dark-alter  transition-all duration-300  ${
            !loading ? "!h-[100px]" : "!h-[0px]"
          }`}
        />
      </div>
      {goToVerify ? (
        <div className="form bg-light-alter dark:bg-dark-alter appear items-center">
          <h1 className="text-success text-center text-4xl">
            Registrado correctamente
          </h1>
          <p className="text-center">
            Gracias por registrarte. Por favor, valida tu dirección de correo
            electrónico haciendo clic en el enlace de confirmación que acabamos
            de enviar a tu dirección.
          </p>
          <Link to="/">
            <Button className="submit primary">Iniciar Sesión</Button>
          </Link>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="form bg-light-alter dark:bg-dark-alter appear"
        >
          <div className="flex gap-2 items-start flex-col">
            {/* <img src={logo} alt="stick notes logo" className="w-10 h-10" /> */}
            LOGO
            <h1 className="primary uppercase text-4xl">Sito Wallet</h1>
          </div>
          <InputControl
            id="email"
            label="Email"
            className="sign-in-input"
            value={email}
            onChange={handleEmail}
            type="email"
            leftComponent={
              <FontAwesomeIcon
                className="absolute primary top-[50%] -translate-y-[50%] left-3"
                icon={faEnvelope}
              />
            }
            helperText={emailHelperText}
          />
          <InputControl
            id="password"
            className="sign-in-input"
            label="Contraseña"
            maxLength={25}
            value={password}
            onChange={handlePassword}
            type={!showPassword ? "password" : "string"}
            leftComponent={
              <IconButton
                tabIndex={-1}
                name="toggle-see-password"
                onClick={toggleShowPassword}
                icon={showPassword ? faLockOpen : faLock}
                className="absolute primary top-[50%] -translate-y-[50%] left-3 !p-0 -ml-[12px]"
                aria-label="click para alternar ver/ocultar contraseña"
              />
            }
            helperText={passwordHelperText}
          />
          <InputControl
            id="rPassword"
            className="sign-in-input"
            label="Repetir Contraseña"
            maxLength={25}
            value={rPassword}
            onChange={handleRPassword}
            type={!showRPassword ? "password" : "string"}
            leftComponent={
              <IconButton
                tabIndex={-1}
                name="toggle-see-r-password"
                onClick={toggleShowRPassword}
                icon={showRPassword ? faLockOpen : faLock}
                className="absolute primary top-[50%] -translate-y-[50%] left-3 !p-0 -ml-[12px]"
                aria-label="click para alternar ver/ocultar repetir contraseña"
              />
            }
          />

          <p className="dark:text-white">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/auth/"
              className="underline hover:text-sdark dark:hover:primary"
            >
              Iniciar sesión
            </Link>
          </p>
          <div className="w-full flex gap-5 justify-end items-center">
            <Button
              name="login"
              type="submit"
              aria-label="Click para entrar"
              className="primary submit"
            >
              Siguiente
            </Button>
          </div>
        </form>
      )}
    </main>
  );
}

export default SignUp;
