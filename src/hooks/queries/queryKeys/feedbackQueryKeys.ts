export const FeedbackQueryKeys = {
  all: () => ({
    queryKey: ["feedback"],
  }),
  list: () => ({
    queryKey: [...FeedbackQueryKeys.all().queryKey, "list"],
  }),
};
