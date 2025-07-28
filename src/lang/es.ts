export const esTexts = {
  errors: {
    "Email not confirmed": "No se ha confirmado el email",
    "Failed to fetch": "No hay conexión",
    "Invalid login credentials": "Usuario o contraseña incorrecta",
  },
};

export const showError = (message) => {
  return esTexts.errors[message] ?? message;
};
