export {};

declare global {
  let args: {
    plainText: string;
    shortcutParameter: {
      /**
       * The month in which the task must be completed (e.g., 10 = October)
       *
       * @default today
       */
      // @ts-expect-error - All props are assumed to be strings
      dueMonth?: number;
      /**
       * The day of the month on which the task must be completed
       *
       * @default today
       */
      // @ts-expect-error - All props are assumed to be strings
      dueDate?: number;
      /**
       * The year in which the task must be completed
       *
       * @default today
       */
      // @ts-expect-error - All props are assumed to be strings
      dueYear?: number;
      /**
       * Is the user flying?
       *
       * @default false
       */
      // @ts-expect-error - All props are assumed to be strings
      isFlying?: boolean | string;
      /**
       * Is the weather warm where the user is going?
       *
       * @default true
       */
      // @ts-expect-error - All props are assumed to be strings
      isWarmWeather?: boolean | string;
      /**
       * Number of nights staying on the trip
       */
      // @ts-ignore
      nightsStaying;
      /**
       * Name of the trip for the sake of creating the packing list top-level entry
       */
      // @ts-expect-error - All props are assumed to be strings
      nameOfTrip;
    };
  };

  let Script: {
    setShortcutOutput: (output: unknown) => void;

    complete: () => void;
  };
}
