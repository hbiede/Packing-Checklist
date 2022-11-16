export {};

declare global {
  let args: {
    plainText: string;
    shortcutParameter: string | Record<string, unknown> | unknown[];
  };

  let Script: {
    setShortcutOutput: (output: unknown) => void;

    complete: () => void;
  };
}
