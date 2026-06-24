export type ProgramProcedure = {
  title: string;
  mode: string;
  durationMinutes: number;
  steps: readonly string[];
  description: string;
};

export type ProgramDay = {
  day: number;
  type: "procedure" | "rest" | "survey";
  procedure?: ProgramProcedure;
  pushTitle: string;
  pushBody: string;
  insightText: string;
};

const CLEANING: ProgramProcedure = {
  title: "Очищение",
  mode: "Cleaning",
  durationMinutes: 5,
  steps: [
    "Увлажните кожу",
    "Нанесите гель",
    "Включите Cleaning",
    "Движения снизу вверх",
  ],
  description: "Мягкое ультразвуковое очищение пор.",
};

const LIFTING: ProgramProcedure = {
  title: "Лифтинг",
  mode: "Lifting",
  durationMinutes: 8,
  steps: [
    "На сухую кожу нанесите масло-проводник",
    "Включите режим Lifting",
    "Прорабатывайте овал лица снизу вверх",
    "Завершите тоником",
  ],
  description: "Микротоковая проработка овала лица.",
};

const ION_MINUS: ProgramProcedure = {
  title: "Десинкрустация",
  mode: "Ion-",
  durationMinutes: 5,
  steps: [
    "Очистите кожу мицеллярной водой",
    "Нанесите щелочной раствор",
    "Включите Ion-",
    "Прорабатывайте зоны с расширенными порами",
  ],
  description: "Глубокая очистка пор гальваническим током.",
};

const ION_PLUS: ProgramProcedure = {
  title: "Ионофорез",
  mode: "Ion+",
  durationMinutes: 5,
  steps: [
    "Нанесите сыворотку с активными ингредиентами",
    "Включите Ion+",
    "Прорабатывайте зоны медленно, без отрыва",
  ],
  description: "Усиленное проникновение активов в кожу.",
};

export const DRIP_CAMPAIGN: readonly ProgramDay[] = [
  {
    day: 1,
    type: "procedure",
    procedure: CLEANING,
    pushTitle: "Готовы к первому ритуалу?",
    pushBody: "Пять минут — и кожа благодарит.",
    insightText: "Ультразвук работает только на влажной коже.",
  },
  {
    day: 2,
    type: "rest",
    pushTitle: "Сегодня — день отдыха",
    pushBody: "Кожа работает, пока вы отдыхаете.",
    insightText: "День отдыха не пропуск, а часть протокола.",
  },
  {
    day: 3,
    type: "procedure",
    procedure: CLEANING,
    pushTitle: "Второй заход. Уже легче.",
    pushBody: "Очищение — основа всего ритуала.",
    insightText: "Регулярность важнее интенсивности.",
  },
  {
    day: 4,
    type: "rest",
    pushTitle: "День отдыха",
    pushBody: "Дайте коже восстановиться.",
    insightText: "Видимое улучшение проявляется к концу второй недели.",
  },
  {
    day: 5,
    type: "procedure",
    procedure: LIFTING,
    pushTitle: "Сегодня попробуем новый режим",
    pushBody: "Лифтинг — восемь минут спокойной работы.",
    insightText: "Микротоки запускают синтез коллагена постепенно.",
  },
  {
    day: 6,
    type: "rest",
    pushTitle: "День отдыха",
    pushBody: "Кожа продолжает работать.",
    insightText: "Пейте больше воды — это часть протокола.",
  },
  {
    day: 7,
    type: "procedure",
    procedure: CLEANING,
    pushTitle: "Неделя позади",
    pushBody: "Ритуал и короткий опрос — две минуты.",
    insightText: "Первая неделя — самый сложный участок. Дальше — легче.",
  },
  {
    day: 8,
    type: "rest",
    pushTitle: "День отдыха",
    pushBody: "Восстановление — тоже ритуал.",
    insightText: "Качество сна напрямую влияет на состояние кожи.",
  },
  {
    day: 9,
    type: "procedure",
    procedure: ION_MINUS,
    pushTitle: "Сегодня — новый режим",
    pushBody: "Десинкрустация очищает поры глубже ультразвука.",
    insightText: "Ion- открывает поры, Ion+ закрывает. Это пара.",
  },
  {
    day: 10,
    type: "rest",
    pushTitle: "День отдыха",
    pushBody: "Десять дней в ритуале. Половина первой трети позади.",
    insightText: "На фото первые изменения видны после третьей недели.",
  },
  {
    day: 11,
    type: "procedure",
    procedure: CLEANING,
    pushTitle: "Очищение",
    pushBody: "Пять минут спокойной работы.",
    insightText: "Тёплая кожа лучше отзывается на ультразвук.",
  },
  {
    day: 12,
    type: "rest",
    pushTitle: "День отдыха",
    pushBody: "Кожа работает, пока вы отдыхаете.",
    insightText: "Не пропускайте дни отдыха — они часть ритуала.",
  },
  {
    day: 13,
    type: "procedure",
    procedure: LIFTING,
    pushTitle: "Лифтинг",
    pushBody: "Восемь минут на овал лица.",
    insightText: "Микротоки работают по нарастающей: эффект суммируется.",
  },
  {
    day: 14,
    type: "rest",
    pushTitle: "Две недели в ритуале",
    pushBody: "Самое время сделать контрольное фото.",
    insightText: "Снимайте при том же свете и под тем же углом, что и первое.",
  },
  {
    day: 15,
    type: "procedure",
    procedure: ION_PLUS,
    pushTitle: "Сегодня — новый режим",
    pushBody: "Ионофорез усиливает действие активов.",
    insightText: "Ion+ работает в паре с вашей сывороткой.",
  },
  {
    day: 16,
    type: "rest",
    pushTitle: "День отдыха",
    pushBody: "Кожа усваивает то, что вы дали ей вчера.",
    insightText: "Активы продолжают работать ещё 24 часа после процедуры.",
  },
  {
    day: 17,
    type: "procedure",
    procedure: CLEANING,
    pushTitle: "Очищение",
    pushBody: "Возвращаемся к основам.",
    insightText: "Очищение должно открывать и закрывать каждую неделю.",
  },
  {
    day: 18,
    type: "rest",
    pushTitle: "День отдыха",
    pushBody: "Передышка.",
    insightText: "Кожа любит постоянство. Регулярность важнее интенсивности.",
  },
  {
    day: 19,
    type: "procedure",
    procedure: LIFTING,
    pushTitle: "Лифтинг",
    pushBody: "Третья проработка овала.",
    insightText: "Овал лица отзывается на микротоки в первую очередь.",
  },
  {
    day: 20,
    type: "rest",
    pushTitle: "День отдыха",
    pushBody: "Двадцать дней. Кожа уже знает ритуал.",
    insightText: "К этому моменту у большинства видны первые изменения.",
  },
  {
    day: 21,
    type: "procedure",
    procedure: ION_MINUS,
    pushTitle: "Десинкрустация",
    pushBody: "Глубокая очистка пор.",
    insightText: "После Ion- кожа особенно восприимчива к активам.",
  },
  {
    day: 22,
    type: "rest",
    pushTitle: "День отдыха",
    pushBody: "Кожа работает.",
    insightText: "Хорошее увлажнение — половина результата.",
  },
  {
    day: 23,
    type: "procedure",
    procedure: CLEANING,
    pushTitle: "Очищение",
    pushBody: "Поддерживающая процедура.",
    insightText: "Не давите на устройство — работайте мягко.",
  },
  {
    day: 24,
    type: "rest",
    pushTitle: "День отдыха",
    pushBody: "Передышка перед второй половиной.",
    insightText: "Свежий воздух и сон — часть протокола.",
  },
  {
    day: 25,
    type: "procedure",
    procedure: LIFTING,
    pushTitle: "Лифтинг",
    pushBody: "Восемь минут на чёткость овала.",
    insightText: "Эффект микротоков накапливается. Не останавливайтесь.",
  },
  {
    day: 26,
    type: "rest",
    pushTitle: "День отдыха",
    pushBody: "Кожа отдыхает, работа продолжается изнутри.",
    insightText: "Регулярность важнее, чем длительность каждой процедуры.",
  },
  {
    day: 27,
    type: "procedure",
    procedure: ION_PLUS,
    pushTitle: "Ионофорез",
    pushBody: "Завершаем третью неделю активов.",
    insightText: "Ion+ работает в паре с витамином C и пептидами.",
  },
  {
    day: 28,
    type: "rest",
    pushTitle: "День отдыха",
    pushBody: "Двадцать восемь дней. Финишная прямая.",
    insightText: "Сейчас самое время сравнить фото с первым днём.",
  },
  {
    day: 29,
    type: "procedure",
    procedure: CLEANING,
    pushTitle: "Очищение",
    pushBody: "Предпоследний день ритуала.",
    insightText: "Ритуал — это привычка, которая остаётся после программы.",
  },
  {
    day: 30,
    type: "procedure",
    procedure: LIFTING,
    pushTitle: "Тридцатый день",
    pushBody: "Финальный лифтинг и короткий опрос.",
    insightText: "Тридцать дней — это база. Дальше — поддерживающий режим.",
  },
];
