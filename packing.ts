import { getTaskPaperString, Task } from './getTaskPaperString';

const main = () => {
  let {
    /**
     * The month in which the task must be completed (e.g., 10 = October)
     *
     * @default today
     */
    // @ts-ignore
    dueMonth = new Date().getMonth() - 1,
    /**
     * The day of the month on which the task must be completed
     *
     * @default today
     */
    // @ts-ignore
    dueDate = new Date().getDate(),
    /**
     * The year in which the task must be completed
     *
     * @default today
     */
    // @ts-ignore
    dueYear = new Date().getYear(),
    /**
     * Is the user flying?
     *
     * @default false
     */
    // @ts-ignore
    isFlying = false as boolean | string,
    /**
     * Is the weather warm where the user is going?
     *
     * @default true
     */
    // @ts-ignore
    isWarmWeather = true as boolean | string,
    /**
     * Number of nights staying on the trip
     */
    // @ts-ignore
    nightsStaying,
    /**
     * Name of the trip for the sake of creating the packing list top-level entry
     */
    // @ts-ignore
    nameOfTrip,
    // @ts-ignore
  } = args.shortcutParameter;

  nightsStaying = Math.ceil(Math.abs(nightsStaying));

  const MAIN: Task = {
    name: `${nameOfTrip} Travel Packing List`,
    due: new Date(dueYear, dueMonth - 1, dueDate, 23, 59, 0),
  };

  if (isFlying === true || isFlying === "true") {
    nightsStaying--;
    MAIN.subtasks = [
      {
        name: "Extra Outfit in Backpack",
      },
    ];
  } else {
    MAIN.subtasks = [
      {
        name: "Fan?",
      },
    ];
  }

  const commonItems: [string, ...(string | Task)[]] = [
    `${nightsStaying} Shirts`,
    "Shoes",
    `${nightsStaying + 1} Pairs of Socks`,
    `${nightsStaying + 1} Pairs of Underwear`,
    `${Math.ceil(nightsStaying / 3)} Sets of Pajamas`,
    "Blanket",
    "Pillow",
    {
      name: "Toiletries",
      subtasks: [
        "Toothbrush",
        "Toothpaste",
        "Deodorant",
        `Shampoo${isFlying ? " (in plastic bag)" : ""}`,
        ...(nightsStaying > 2 ? ["Razor"] : []),
      ],
    } as Task,
    "Phone Charger",
    "Deck of Cards",
    "Headphones",
    "Headphones Charger",
    "iPad/Kindle",
  ];
  if (MAIN.subtasks && MAIN.subtasks.length > 0) {
    MAIN.subtasks.push(...commonItems);
  } else {
    MAIN.subtasks = commonItems;
  }

  if (isWarmWeather === true || isWarmWeather === "true") {
    MAIN.subtasks.push(
      `${nightsStaying} Pairs of Shorts`,
      "Swimsuit?",
      "Sunglasses"
    );
  } else {
    MAIN.subtasks.push(
      `${Math.ceil(nightsStaying / 2)} Pairs of Shorts`,
      "Jacket/Coat",
      `${nightsStaying} Sweaters`
    );
  }

  return getTaskPaperString(MAIN);
};

Script.setShortcutOutput(main());
