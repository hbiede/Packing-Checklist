import { getTaskPaperString, Task } from './getTaskPaperString';

const main = () => {
  let {
    dueMonth = new Date().getMonth() - 1,
    dueDate = new Date().getDate(),
    dueYear = new Date().getFullYear(),
    isFlying = false as boolean | string,
    isWarmWeather = true as boolean | string,
    nightsStaying,
    nameOfTrip,
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
  } else {
    MAIN.subtasks = [
      {
        name: 'Fan?',
      },
    ];
  }

  const commonItems: [Task | string, ...(string | Task)[]] = [
    {
      name: 'Clothing',
      subtasks: [
        `${nightsStaying} Shirts`,
        'Shoes',
        `${nightsStaying + 1} Pairs of Socks`,
        `${nightsStaying + 1} Pairs of Underwear`,
        `${Math.ceil(nightsStaying / 3)} Sets of Pajamas`,
        ...(isWarmWeather === true || isWarmWeather === 'true'
          ? [`${nightsStaying} Pairs of Shorts`, 'Swimsuit?', 'Sunglasses']
          : [
              `${Math.ceil(nightsStaying / 2)} Pairs of Shorts`,
              'Jacket/Coat',
              `${nightsStaying} Sweaters`,
            ]),
      ],
    } as Task,
    'Blanket',
    'Pillow',
    {
      name: 'Toiletries',
      subtasks: [
        'Toothbrush',
        'Toothpaste',
        'Deodorant',
        `Shampoo${isFlying ? ' (in plastic bag)' : ''}`,
        'Soap',
        ...(isWarmWeather === true || isWarmWeather === 'true'
          ? []
          : ['Chapstick']),
        ...(nightsStaying > 2 ? ['Razor'] : []),
      ],
    } as Task,
    'Phone Charger',
    'Deck of Cards',
    'Headphones',
    'Headphones Charger',
    'iPad/Kindle',
  ];

  MAIN.subtasks = [...(MAIN.subtasks ?? []), ...commonItems];

  return getTaskPaperString(MAIN);
};

Script.setShortcutOutput(main());
