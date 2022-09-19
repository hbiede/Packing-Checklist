type Task = {
  name: string;
  subtasks?: [Task | string, ...(Task | string)[]];

  /**
   * @default true
   */
  autodone?: boolean;
  defer?: Date;
  done?: Date;
  due?: Date;
  flagged?: boolean;
  /**
   * @default true
   */
  parallel?: boolean;
  tags?: [string, ...string[]];
} & (
  | {
      repeatMethod: 'fixed' | 'start-after-completion' | 'due-after-completion';
      /**
       * ICS repeat rule (see {@link https://www.ietf.org/rfc/rfc2445.txt RCF244557})
       */
      repeatRule: string;
    }
  | {
      repeatMethod?: never;
      repeatRule?: never;
    }
);

const getMetadataString = ({
  autodone = true,
  defer,
  done,
  due,
  flagged,
  parallel = true,
  repeatMethod,
  repeatRule,
  tags,
}: Task) => {
  let result = [`@autodone(${autodone})`];

  if (defer) {
    result.push(`@defer(${defer.toISOString()})`);
  }
  if (done) {
    result.push(`@done(${done.toISOString()})`);
  }
  if (due) {
    result.push(`@due(${due.toISOString()})`);
  }

  if (flagged !== undefined) {
    result.push(`@flagged(${flagged})`);
  }

  if (parallel !== undefined) {
    result.push(`@parallel(${parallel})`);
  }

  if (repeatMethod) {
    result.push(`@repeat-method(${repeatMethod})`, `@repeat-rule${repeatRule}`);
  }

  if (tags && tags.length > 0) {
    result.push(`@tags(${tags.filter(tag => !!tag).join(', ')})`);
  }

  return result.join(' ');
};

const printTask = (task: Task) => {
  const result: string[] = [];
  let indentLength = 0;
  let queue: (Task | string | null)[] = [task];

  while (queue.length > 0) {
    let current = queue[0];
    queue = queue.slice(1);

    if (current === null) {
      // null is a flag for the end of a list of subtasks
      indentLength--;
      continue;
    }

    if (typeof current === 'string') {
      result.push(`${'\t'.repeat(indentLength)}- ${current}`);
    } else {
      result.push(
        `${'\t'.repeat(indentLength)}- ${current.name} ${getMetadataString(
          current,
        )}`.trimRight(),
      );
      if (current.subtasks && current.subtasks.length > 0) {
        queue = [...current.subtasks, null, ...queue];
        indentLength++;
      }
    }
  }
  return result.join('\n');
};

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

  if (isFlying === true || isFlying === 'true') {
    nightsStaying--;
    MAIN.subtasks = [
      {
        name: 'Extra Outfit in Backpack',
      },
    ];
  }

  const commonItems: [string, ...(string | Task)[]] = [
    `${nightsStaying} Shirts`,
    'Shoes',
    `${nightsStaying + 1} Pairs of Socks`,
    `${nightsStaying + 1} Pairs of Underwear`,
    `${Math.ceil(nightsStaying / 3)} Sets of Pajamas`,
    'Blanket',
    'Pillow',
    {
      name: 'Toiletries',
      subtasks: [
        'Toothbrush',
        'Toothpaste',
        'Deodorant',
        `Shampoo${isFlying ? ' (in plastic bag)' : ''}`,
        ...(nightsStaying > 2 ? ['Razor'] : []),
      ],
    } as Task,
    'Phone Charger',
    'Deck of Cards',
    'Headphones',
    'Headphones Charger',
    'iPad/Kindle',
  ];
  if (MAIN.subtasks && MAIN.subtasks.length > 0) {
    MAIN.subtasks.push(...commonItems);
  } else {
    MAIN.subtasks = commonItems;
  }

  if (isWarmWeather === true || isWarmWeather === 'true') {
    MAIN.subtasks.push(
        `${nightsStaying} Pairs of Shorts`,
        'Swimsuit?',
        'Sunglasses',
    );
  } else {
    MAIN.subtasks.push(
        `${Math.ceil(nightsStaying / 2)} Pairs of Shorts`,
        'Jacket/Coat',
        `${nightsStaying} Sweaters`,
    );
  }

  return printTask(MAIN);
}

Script.setShortcutOutput(main());
