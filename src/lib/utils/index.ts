export * from "./parseBaseColumns";
export * from "./file";

export const randomBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const randomBackgroundColor = () => {
  const colors = ["primary", "secondary", "tertiary", "quaternary"];
  return colors[randomBetween(0, colors.length - 1)] as
    | "primary"
    | "secondary"
    | "tertiary"
    | "quaternary";
};
