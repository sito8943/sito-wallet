export const navigateWithWindow = (route: string | number) => {
  if (typeof route === "number") {
    window.history.go(route);
    return;
  }

  window.location.assign(route);
};
