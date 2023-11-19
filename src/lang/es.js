export const esTexts = {
  errors: {
    "Email not confirmed": "No se ha confirmado el email",
  },
};

export const showError = (message) => {
  return esTexts.errors[message] ?? message;
};
