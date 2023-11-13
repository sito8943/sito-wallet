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

// images
// import logo from "../../assets/images/logo.png";

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
        setUserState({
          type: "logged-in",
          user: {
            ...data.user,
          },
        });
        navigate("/");
      } else setNotification({ type: "error", message: error.message });
      setLoading(false);
    },
    [email, password, rPassword, setNotification, navigate, setUserState]
  );

  return (
    <main className="w-full min-h-screen flex items-center justify-center">
      <ModeButton className="top-1 right-1 icon-button primary" />
      {loading ? (
        <Loading className="fixed-loading" />
      ) : (
        <form
          onSubmit={onSubmit}
          className="rounded-sm appear relative bg-light dark:bg-dark p-10 min-w-[440px] flex flex-col gap-3 shadow-xl shadow-dark-[black]"
        >
          <div className="flex gap-2 items-center">
            {/* <img src={logo} alt="stick notes logo" className="w-10 h-10" /> */}
            LOGO
            <h1 className="text-sdark primary uppercase">Sito Wallet</h1>
          </div>
          <InputControl
            id="email"
            className="input border-none submit !pl-8 w-full"
            label="Email"
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
            className="input border-none submit !pl-8 w-full"
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
            className="input border-none submit !pl-8 w-full"
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
