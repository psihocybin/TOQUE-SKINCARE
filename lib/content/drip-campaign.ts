export type ProgramProcedure = {
  title: string;
  mode: string;
  durationMinutes: number;
};

export type ProgramDay = {
  day: number;
  type: "procedure" | "rest" | "survey";
  procedure?: ProgramProcedure;
  pushTitle: string;
  pushBody: string;
  insightText: string;
  // slug устройства из lib/content/devices.ts. Если задан — на карточке дня
  // показываем апсейл-блок с этим устройством.
  upsellDevice?: string;
};

const CLEANING: ProgramProcedure = {
  title: "Очищение",
  mode: "Cleaning",
  durationMinutes: 5,
};

const LIFTING: ProgramProcedure = {
  title: "Лифтинг",
  mode: "Lifting",
  durationMinutes: 8,
};

const ION_MINUS: ProgramProcedure = {
  title: "Дезинкрустация",
  mode: "Ion-",
  durationMinutes: 5,
};

const ION_PLUS: ProgramProcedure = {
  title: "Ионофорез",
  mode: "Ion+",
  durationMinutes: 5,
};

export const DRIP_CAMPAIGN: readonly ProgramDay[] = [
  {
    day: 1,
    type: "procedure",
    procedure: CLEANING,
    pushTitle: "Доброе утро",
    pushBody: "Готовы к первому ритуалу? Это займёт 5 минут.",
    insightText: "Ультразвук работает только на влажной коже.",
  },
  {
    day: 2,
    type: "rest",
    pushTitle: "Сегодня день отдыха",
    pushBody: "Кожа работает, пока вы отдыхаете. Увидимся завтра.",
    insightText: "День отдыха не пропуск, а часть протокола.",
  },
  {
    day: 3,
    type: "procedure",
    procedure: CLEANING,
    pushTitle: "Время для ритуала",
    pushBody: "Очищение, 5 минут — как вчера, уже знакомо.",
    insightText: "Регулярность важнее интенсивности.",
  },
  {
    day: 4,
    type: "rest",
    pushTitle: "Сегодня день отдыха",
    pushBody: "Ничего делать не нужно — это тоже часть протокола.",
    insightText: "Видимое улучшение проявляется к концу второй недели.",
  },
  {
    day: 5,
    type: "procedure",
    procedure: LIFTING,
    pushTitle: "Новый режим сегодня",
    pushBody: "Попробуем лифтинг — другое ощущение, 8 минут.",
    insightText: "Микротоки запускают синтез коллагена постепенно.",
  },
  {
    day: 6,
    type: "rest",
    pushTitle: "Сегодня день отдыха",
    pushBody:
      "Лёгкий день. Загляните в совет дня — там о питании для кожи.",
    insightText:
      "Омега-3 (рыба, льняное масло) поддерживают барьерную функцию кожи — она хуже теряет влагу.",
  },
  {
    day: 7,
    type: "procedure",
    procedure: CLEANING,
    pushTitle: "Неделя позади",
    pushBody: "Первая неделя — самая сложная. Дальше будет легче.",
    insightText: "Первая неделя — самый сложный участок. Дальше — легче.",
  },
  {
    day: 8,
    type: "rest",
    pushTitle: "Сегодня день отдыха",
    pushBody: "Время выспаться — это тоже часть ухода.",
    insightText: "Качество сна напрямую влияет на состояние кожи.",
  },
  {
    day: 9,
    type: "procedure",
    procedure: ION_MINUS,
    pushTitle: "Новый режим: Ion-",
    pushBody: "Дезинкрустация — глубокое очищение пор, 5 минут.",
    insightText: "Ion- открывает поры, Ion+ закрывает. Это пара.",
  },
  {
    day: 10,
    type: "rest",
    pushTitle: "Сегодня день отдыха",
    pushBody: "Самое время сравнить первое фото с тем, что сейчас.",
    insightText: "На фото первые изменения видны после третьей недели.",
  },
  {
    day: 11,
    type: "procedure",
    procedure: CLEANING,
    pushTitle: "Время для ритуала",
    pushBody: "Очищение снова — уже привычное движение.",
    insightText:
      "Кортизол (гормон стресса) повышает выработку кожного сала. Спокойствие — тоже часть ухода.",
  },
  {
    day: 12,
    type: "rest",
    pushTitle: "Сегодня день отдыха",
    pushBody:
      "Кортизол и кожа связаны больше, чем кажется — загляните в совет дня.",
    insightText: "Не пропускайте дни отдыха — они часть ритуала.",
  },
  {
    day: 13,
    type: "procedure",
    procedure: LIFTING,
    pushTitle: "Время для ритуала",
    pushBody: "Лифтинг, 8 минут — эффект уже накапливается.",
    insightText: "Микротоки работают по нарастающей: эффект суммируется.",
  },
  {
    day: 14,
    type: "rest",
    pushTitle: "Сегодня день отдыха",
    pushBody: "Сделайте фото в том же месте, что и раньше.",
    insightText: "Снимайте при том же свете и под тем же углом, что и первое.",
  },
  {
    day: 15,
    type: "procedure",
    procedure: ION_PLUS,
    pushTitle: "Новый режим: Ion+",
    pushBody: "Ионофорез — для глубокого проникновения сыворотки.",
    insightText: "Ion+ работает в паре с вашей сывороткой.",
  },
  {
    day: 16,
    type: "rest",
    pushTitle: "Сегодня день отдыха",
    pushBody: "О выборе солнцезащиты — в совете дня.",
    insightText: "Активы продолжают работать ещё 24 часа после процедуры.",
  },
  {
    day: 17,
    type: "procedure",
    procedure: CLEANING,
    pushTitle: "Время для ритуала",
    pushBody: "Полный цикл: очищение → дезинкрустация → ионофорез.",
    insightText: "Очищение должно открывать и закрывать каждую неделю.",
  },
  {
    day: 18,
    type: "rest",
    pushTitle: "Сегодня день отдыха",
    pushBody: "Сон и кожа связаны напрямую — подробнее в совете дня.",
    insightText: "Кожа любит постоянство. Регулярность важнее интенсивности.",
  },
  {
    day: 19,
    type: "procedure",
    procedure: LIFTING,
    pushTitle: "Время для ритуала",
    pushBody: "Лифтинг снова. Эффект накопительный, не мгновенный.",
    insightText: "Овал лица отзывается на микротоки в первую очередь.",
  },
  {
    day: 20,
    type: "rest",
    pushTitle: "Контрольная точка",
    pushBody: "Прошло 20 дней — время для нового фото-сравнения.",
    insightText: "К этому моменту у большинства видны первые изменения.",
  },
  {
    day: 21,
    type: "procedure",
    procedure: ION_MINUS,
    pushTitle: "Новый режим: Ion-",
    pushBody: "Промокод TOQUERITUAL15 — скидка 15% на гель.",
    insightText: "После Ion- кожа особенно восприимчива к активам.",
  },
  {
    day: 22,
    type: "rest",
    pushTitle: "Сегодня день отдыха",
    pushBody: "Гель или крем? В совете дня — почему текстура важна.",
    insightText: "Хорошее увлажнение — половина результата.",
  },
  {
    day: 23,
    type: "procedure",
    procedure: CLEANING,
    pushTitle: "Время для ритуала",
    pushBody: "Очищение — уже автоматическое движение, без раздумий.",
    insightText: "Не давите на устройство — работайте мягко.",
  },
  {
    day: 24,
    type: "rest",
    pushTitle: "Сегодня день отдыха",
    pushBody:
      "Тёплая вода вместо горячей — мелочь, которая имеет значение.",
    insightText:
      "Горячая вода при умывании разрушает защитный барьер кожи — используйте тёплую или прохладную.",
  },
  {
    day: 25,
    type: "procedure",
    procedure: LIFTING,
    pushTitle: "Время для ритуала",
    pushBody: "Лифтинг, 8 минут — вы на финишной прямой программы.",
    insightText: "Эффект микротоков накапливается. Не останавливайтесь.",
  },
  {
    day: 26,
    type: "rest",
    pushTitle: "Сегодня день отдыха",
    pushBody: "Пять минут в день эффективнее получаса раз в неделю.",
    insightText: "Регулярность важнее, чем длительность каждой процедуры.",
  },
  {
    day: 27,
    type: "procedure",
    procedure: ION_PLUS,
    pushTitle: "Новый режим: Ion+",
    pushBody: "ELARA — следующий шаг. Промокод TOQUERITUAL15.",
    insightText: "Ion+ работает в паре с витамином C и пептидами.",
    upsellDevice: "elara",
  },
  {
    day: 28,
    type: "rest",
    pushTitle: "Сегодня день отдыха",
    pushBody: "Сравните сегодняшнее фото с первым днём — разница заметна.",
    insightText: "Сейчас самое время сравнить фото с первым днём.",
  },
  {
    day: 29,
    type: "procedure",
    procedure: CLEANING,
    pushTitle: "Почти месяц",
    pushBody:
      "Завтра — 30 дней. Ритуал, который вы построили, остаётся с вами.",
    insightText: "Ритуал — это привычка, которая остаётся после программы.",
  },
  {
    day: 30,
    type: "procedure",
    procedure: LIFTING,
    pushTitle: "Месяц с TOQUE",
    pushBody: "Тридцать дней позади. Промокод TOQUERITUAL15 ждёт.",
    insightText: "Тридцать дней — это база. Дальше — поддерживающий режим.",
    upsellDevice: "elara",
  },
];
