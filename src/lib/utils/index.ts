export * from "./parseBaseColumns";
export * from "./file";
export * from "./authAccountSnapshot";
export * from "./sessionAccess";
export * from "./featureFlags";
export * from "./filterNormalization";
export * from "./hideDeletedEntities";
export * from "./persistedTableOptions";
export * from "./locale";

export const randomBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const randomBackgroundColor = () => {
  const colors = ["primary"];
  return colors[randomBetween(0, colors.length - 1)] as "primary";
};
