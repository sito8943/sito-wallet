/** Copies text and notifies the result; resolves to true on success. */
export type CopyToClipboardFn = (text: string) => Promise<boolean>;
