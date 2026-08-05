// Протоколы применения устройств TOQUE — детальные шаги, подготовка,
// частота использования. Отдельный слой контента от lib/content/devices.ts
// (тот — каталог для апсейла/экосистемы; этот — как физически пользоваться
// устройством). Раздел находится в процессе наполнения: у части устройств
// пока есть только проверенная частота применения, без детальных шагов —
// это сделано намеренно, чтобы не публиковать непроверенные технические
// инструкции для космитологических приборов.

export type ProcedureStep = {
  text: string;
};

export type ProcedureMode = {
  name: string;
  displayName?: string; // короткое нетехническое название для UI (Home, /ritual)
  durationMinutes: number;
  medium: string; // что наносить
  mediumType: "gel" | "serum" | "cream" | "oil" | "none" | "dry";
  // gel/serum/cream — водная основа (EMS/микротоки/УЗ)
  // oil — масло/жирный крем (только без электрического тока)
  // none — ничего не нужно (ANIMA, NOVA, AERIS)
  // dry — кожа может быть сухой (COLD режим PULSAR)
  hasElectricCurrent: boolean; // если true — масло запрещено
  steps: ProcedureStep[];
  note?: string;
  ledColor?: string;
};

export type DeviceProtocol = {
  deviceSlug: string;
  category: "cleansing" | "ems" | "led" | "massage" | "eyes" | "scalp" | "body";
  hasElectricModes: boolean; // есть ли режимы с током
  // Черновой протокол — технические параметры не подтверждены, не публиковать
  // как финальную инструкцию пользователю без проверки.
  isDraft?: boolean;
  preparationSteps: string[];
  modes: ProcedureMode[];
  completionSteps: string[];
  frequency: {
    timesPerWeek: number | "daily"; // сколько раз в неделю
    label: string; // "2-3 раза в неделю"
    note?: string; // уточнение по режимам
  };
  weeklySchedule?: string; // рекомендация по дням
  canUseDailyLight?: boolean; // можно ли лёгкие режимы ежедневно
  pairsWellWith: string[];
  importantRules: string[];
};

// ────────────────────────────────────────────
// AURA (AURA EMS) — финальные данные. В новой версии есть ОДИН режим
// с микротоками (0,22 мА / 100 Гц) — только в нём запрещено масло.
// Остальные режимы — микромассаж/прогрев/LED без тока, масло разрешено.
// ────────────────────────────────────────────
const AURA_PROTOCOL: DeviceProtocol = {
  deviceSlug: "aura",
  category: "massage",
  hasElectricModes: true,
  preparationSteps: [
    "Очистите кожу от макияжа",
    "Для режимов 1-4 и 6: нанесите масло или питательный крем",
    "Для режима 5 (нагрев + микротоки): только сыворотка или крем на водной основе — ток не работает через масло",
  ],
  modes: [
    {
      name: "Микромассаж + красный LED",
      displayName: "Микромассаж + красный LED",
      durationMinutes: 5,
      medium: "Массажное масло или питательный крем",
      mediumType: "oil",
      hasElectricCurrent: false,
      steps: [
        { text: "Нанесите масло на лицо, шею, декольте" },
        { text: "Включите режим 1 (1 нажатие)" },
        { text: "Шея: движения снизу вверх от ключиц к подбородку" },
        { text: "Щёки: от носа к ушам вдоль скулы" },
        { text: "Лоб: от центра к вискам" },
        { text: "Декольте: движения к ключицам" },
      ],
    },
    {
      name: "Нагрев + красный LED",
      displayName: "Нагрев + красный LED",
      durationMinutes: 5,
      medium: "Массажное масло или питательный крем",
      mediumType: "oil",
      hasElectricCurrent: false,
      steps: [
        { text: "Нанесите масло — нагрев усиливает его действие" },
        { text: "Включите режим 3 (3 нажатия)" },
        { text: "Замедлите движения вдвое относительно режима 1" },
        { text: "Задержитесь на зонах с пониженным тонусом" },
      ],
      note: "Нагрев усиливает проникновение масла — движения медленнее",
    },
    {
      name: "Нагрев + микротоки",
      displayName: "Нагрев + микротоки",
      durationMinutes: 5,
      medium: "Сыворотка или крем на водной основе",
      mediumType: "serum",
      hasElectricCurrent: true,
      steps: [
        { text: "СМЕНИТЕ СРЕДСТВО: нанесите сыворотку или крем на водной основе" },
        { text: "Включите режим 5 (5 нажатий)" },
        { text: "Плавные движения по массажным линиям" },
        { text: "Особое внимание зонам с ощущением отёчности" },
      ],
      note: "В этом режиме работают микротоки — масло запрещено, только водная основа",
    },
    {
      name: "Ручной роликовый массаж",
      displayName: "Ручной массаж",
      durationMinutes: 5,
      medium: "Масло или крем — по выбору",
      mediumType: "oil",
      hasElectricCurrent: false,
      steps: [
        { text: "Без электрики — механическая проработка" },
        { text: "Используйте как завершающий этап или самостоятельно" },
        { text: "Движения те же что в режиме 1" },
      ],
    },
  ],
  completionSteps: [
    "Остатки масла распределите по коже или промокните салфеткой",
    "Если работали в режиме 5 — нанесите крем поверх сыворотки",
    "Днём — SPF",
  ],
  frequency: {
    timesPerWeek: "daily",
    label: "Ежедневно, 5-10 минут",
    note: "Режим 5 (микротоки) — не чаще 1 раза в день",
  },
  canUseDailyLight: true,
  pairsWellWith: ["nuo", "nuo-pro", "elara", "anima"],
  importantRules: [
    "Режим 5 (нагрев + микротоки): ТОЛЬКО водная основа",
    "Режимы 1-4 и 6: масло и кремы разрешены",
    "Не применять эфирные масла, спирт и агрессивные средства",
    "Устройство отключается через 5 минут автоматически",
  ],
};

// ────────────────────────────────────────────
// Устройства с проверенной частотой, но без детальных шагов протокола.
// Шаги намеренно не заполнены — это чувствительная зона (космитологические
// приборы с EMS/УЗ), инструкции появятся после проверки у технического
// специалиста, чтобы не повторить ошибку, которая была в протоколе AURA.
// ────────────────────────────────────────────

const NUO_PROTOCOL: DeviceProtocol = {
  deviceSlug: "nuo",
  category: "cleansing",
  hasElectricModes: true,
  preparationSteps: [
    "Очистите кожу от макияжа",
    "Средство наносится непосредственно перед каждым режимом — см. шаги ниже",
  ],
  modes: [
    {
      name: "Cleaning (УЗ-очищение)",
      displayName: "Очищение",
      durationMinutes: 5,
      medium: "Проводящий гель TOQUE CARE",
      mediumType: "gel",
      hasElectricCurrent: true,
      steps: [
        { text: "Нанесите проводящий гель на влажную кожу" },
        { text: "Включите режим Cleaning" },
        { text: "Держите лопатку под углом 45° к коже, выпуклой стороной вверх" },
        { text: "Двигайтесь от центра лица к периферии, не более 3-4 проходов на зону" },
        { text: "Смойте остатки геля тёплой водой, нанесите тоник" },
      ],
      note: "Масло не использовать — ультразвук не работает через липидную плёнку",
    },
    {
      name: "Lifting (микротоки)",
      displayName: "Лифтинг",
      durationMinutes: 8,
      medium: "Сыворотка, гель или лёгкий крем на водной основе",
      mediumType: "serum",
      hasElectricCurrent: true,
      steps: [
        { text: "Нанесите сыворотку или гель на водной основе" },
        { text: "Включите режим Lifting" },
        { text: "Лопатка под углом 45° к коже, выпуклой стороной вниз" },
        { text: "Движения по массажным линиям от центра к периферии" },
        { text: "Особое внимание зонам со сниженным тонусом и овалу лица" },
        { text: "Остатки средства можно не смывать — распределите по коже" },
      ],
      note: "Во время процедуры Lifting — пальцы на боковых электродах держать не нужно",
    },
    {
      name: "Ion- (дезинкрустация)",
      displayName: "Глубокая чистка",
      durationMinutes: 5,
      medium: "Проводящий гель (гель-дезинкрустант)",
      mediumType: "gel",
      hasElectricCurrent: true,
      steps: [
        { text: "Нанесите проводящий гель на кожу" },
        { text: "Включите режим Ion-" },
        { text: "Лопатка под углом 45°, выпуклой стороной вверх" },
        { text: "Движения против роста пушковых волос, от периферии к центру" },
        { text: "Особое внимание носу, лбу, подбородку" },
        { text: "Смойте гель тёплой водой, нанесите тоник" },
      ],
      note: "Используйте сразу после Cleaning для усиления эффекта. Только гель — не сыворотка и не масло",
    },
    {
      name: "Ion+ (ионофорез)",
      displayName: "Ионофорез",
      durationMinutes: 5,
      medium: "Сыворотка с активными компонентами (гиалуронат, ниацинамид, пептиды)",
      mediumType: "serum",
      hasElectricCurrent: true,
      steps: [
        { text: "Нанесите сыворотку на чистую кожу" },
        { text: "Включите режим Ion+" },
        { text: "Движения по массажным линиям от центра к периферии" },
        { text: "Касайтесь боковых электродов пальцами для замыкания цепи" },
        { text: "Не более 3-4 проходов на зону, около 10 минут" },
        { text: "Остатки сыворотки не смывать — распределите по коже" },
      ],
      note: "Подходит для сывороток с гиалуроновой кислотой, ниацинамидом и пептидами — они лучше проводят ток",
    },
  ],
  completionSteps: [],
  frequency: {
    timesPerWeek: 2,
    label: "1-2 раза в неделю",
    note: "Cleaning и Ion- — 1-2 раза/нед. Ion+ и Lifting — до 3 раз/нед",
  },
  weeklySchedule: "Пн/Чт — Cleaning + Ion-, Вт/Пт — Ion+ или Lifting",
  pairsWellWith: ["elara", "anima"],
  importantRules: [
    "Все режимы — только водная основа (гель, сыворотка, лёгкий крем). Масло блокирует и ультразвук, и ток",
    "Ion+: касайтесь боковых электродов пальцами для замыкания цепи",
    "Ion- используйте сразу после Cleaning для усиления эффекта",
  ],
};

const NUO_PRO_PROTOCOL: DeviceProtocol = {
  ...NUO_PROTOCOL,
  deviceSlug: "nuo-pro",
};

const LUMERA_PROTOCOL: DeviceProtocol = {
  deviceSlug: "lumera",
  category: "cleansing",
  hasElectricModes: true,
  preparationSteps: [],
  modes: [],
  completionSteps: [],
  frequency: {
    timesPerWeek: 2,
    label: "1-2 раза в неделю (УЗ), LED-режимы — до 5 раз",
  },
  pairsWellWith: ["elara"],
  importantRules: ["Детальные шаги протокола уточняются"],
};

const ELARA_PROTOCOL: DeviceProtocol = {
  deviceSlug: "elara",
  category: "ems",
  hasElectricModes: true,
  preparationSteps: [],
  modes: [],
  completionSteps: [],
  frequency: {
    timesPerWeek: 3,
    label: "2-3 раза в неделю",
    note: "Для экспресс-ухода утром — 2-3 минуты ежедневно",
  },
  canUseDailyLight: true,
  pairsWellWith: ["nuo", "nuo-pro", "lumera"],
  importantRules: ["Детальные шаги протокола уточняются"],
};

const PULSAR_PROTOCOL: DeviceProtocol = {
  deviceSlug: "pulsar",
  category: "ems",
  hasElectricModes: true,
  preparationSteps: [],
  modes: [],
  completionSteps: [],
  frequency: {
    timesPerWeek: "daily",
    label: "2-3 раза в неделю, возможно ежедневно",
    note: "EMS и RF — 2-3 раза/нед. COLD и VR — ежедневно",
  },
  canUseDailyLight: true,
  pairsWellWith: ["nuo"],
  importantRules: ["Детальные шаги протокола уточняются"],
};

const ANIMA_PROTOCOL: DeviceProtocol = {
  deviceSlug: "anima",
  category: "led",
  hasElectricModes: false,
  preparationSteps: [],
  modes: [
    {
      name: "LED-сессия",
      displayName: "Световая терапия",
      durationMinutes: 15,
      medium: "",
      mediumType: "none",
      hasElectricCurrent: false,
      steps: [
        { text: "Очистите кожу перед процедурой" },
        { text: "Наденьте маску, отрегулируйте ремешок" },
        { text: "Выберите программу на пульте управления" },
        { text: "Лягте удобно — 10-20 минут" },
        { text: "После — нанесите увлажняющий крем" },
      ],
      note: "Не смотреть прямо на диоды. Снять контактные линзы.",
    },
  ],
  completionSteps: [],
  frequency: {
    timesPerWeek: 4,
    label: "3-5 раз в неделю, 10-20 минут",
  },
  weeklySchedule: "Anti-age: Пн/Ср красный+NIR, Вт/Чт жёлтый. Пауза в выходные",
  pairsWellWith: ["nuo", "nuo-pro"],
  importantRules: [
    "Не смотреть прямо на диоды",
    "Снять контактные линзы перед процедурой",
  ],
};

const NOVA_PROTOCOL: DeviceProtocol = {
  deviceSlug: "nova",
  category: "eyes",
  hasElectricModes: false,
  preparationSteps: [],
  modes: [
    {
      name: "Массаж вокруг глаз",
      displayName: "Массаж глаз",
      durationMinutes: 15,
      medium: "",
      mediumType: "none",
      hasElectricCurrent: false,
      steps: [
        { text: "Снимите контактные линзы" },
        { text: "Удалите макияж с области глаз" },
        { text: "Наденьте очки, отрегулируйте посадку" },
        { text: "Выберите режим (1 — мягкий, 2 — стандартный, 3 — интенсивный)" },
        { text: "Расслабьтесь — устройство отключится автоматически через 15 минут" },
      ],
      note: "Не использовать при глаукоме и воспалении глаз",
    },
  ],
  completionSteps: [],
  frequency: {
    timesPerWeek: "daily",
    label: "Ежедневно, 15 минут (автотаймер)",
  },
  pairsWellWith: ["nuo"],
  importantRules: ["Не использовать при глаукоме и воспалении глаз"],
};

const AERIS_PROTOCOL: DeviceProtocol = {
  ...NOVA_PROTOCOL,
  deviceSlug: "aeris",
  category: "eyes",
};

const QUANTUM_PROTOCOL: DeviceProtocol = {
  deviceSlug: "quantum",
  category: "scalp",
  hasElectricModes: true,
  preparationSteps: [],
  modes: [
    {
      name: "EMS + вибромассаж",
      displayName: "Уход за кожей головы",
      durationMinutes: 12,
      medium: "Сыворотка в резервуар насадки-гребня (для EMS)",
      mediumType: "serum",
      hasElectricCurrent: true,
      steps: [
        { text: "Выберите насадку под задачу" },
        { text: "Для EMS: нанесите сыворотку в резервуар гребня" },
        { text: "Начните с кожи головы — расчёсывающие движения" },
        { text: "Для лица: используйте контактную насадку с гелем" },
        { text: "10-15 минут суммарно" },
      ],
      note: "Для EMS — только водная основа. Для вибрации без EMS — масло допустимо",
    },
  ],
  completionSteps: [],
  frequency: {
    timesPerWeek: 3,
    label: "2-3 раза в неделю для EMS, вибрация — ежедневно",
  },
  canUseDailyLight: true,
  pairsWellWith: [],
  importantRules: ["Для EMS — только водная основа. Для вибрации без EMS — масло допустимо"],
};

const VIBE_PROTOCOL: DeviceProtocol = {
  deviceSlug: "vibe",
  category: "body",
  hasElectricModes: false,
  preparationSteps: [],
  modes: [
    {
      name: "Перкуссионный массаж",
      displayName: "Перкуссионный массаж",
      durationMinutes: 5,
      medium: "Масло или крем (опционально)",
      mediumType: "oil",
      hasElectricCurrent: false,
      steps: [
        { text: "Выберите насадку (мягкая — для лица)" },
        { text: "Начните со скорости 1" },
        { text: "Держите перпендикулярно к мышце" },
        { text: "Без давления — устройство работает само" },
        { text: "30-60 секунд на каждую зону" },
      ],
      note: "Для лица — только мягкая насадка, скорость 1-2. Максимум 2 минуты на лицо",
    },
  ],
  completionSteps: [],
  frequency: {
    timesPerWeek: 3,
    label: "2-3 раза в неделю для лица, тело — ежедневно",
  },
  pairsWellWith: [],
  importantRules: ["Для лица — только мягкая насадка, скорость 1-2, максимум 2 минуты"],
};

// ────────────────────────────────────────────
// LYRA — финальный протокол. Технология DualCare™: ActiveTone (микротоки
// 0,7 мА + LED) и DeepCalm (тепло + вибрация + LED, без тока).
// ────────────────────────────────────────────

const LYRA_PROTOCOL: DeviceProtocol = {
  deviceSlug: "lyra",
  category: "ems",
  hasElectricModes: true,
  preparationSteps: [
    "Очистите кожу, промокните полотенцем",
    "Нанесите проводящее средство на водной основе — гель-проводник, сыворотка или лёгкий крем",
    "Выберите LED-спектр под задачу кожи",
  ],
  modes: [
    {
      name: "ActiveTone (микротоки + LED)",
      displayName: "Активный тонус",
      durationMinutes: 7,
      medium: "Проводящий гель или сыворотка на водной основе",
      mediumType: "gel",
      hasElectricCurrent: true,
      ledColor:
        "выбирается кнопкой: красный/синий/зелёный/жёлтый/фиолетовый",
      steps: [
        { text: "Нанесите проводящее средство" },
        { text: "Включите LYRA — режим ActiveTone" },
        {
          text: "Выберите LED-спектр: красный (anti-age), зелёный (тон), жёлтый (свежесть), синий (воспаления), фиолетовый (комплекс)",
        },
        { text: "Роликами прокладывайте путь по массажным линиям" },
        { text: "Шея: снизу вверх по боковой поверхности" },
        { text: "Лицо: от центра к вискам, снизу вверх" },
        { text: "Декольте: движения к ключицам" },
      ],
      note: "0,7 мА — это микротоки. Масло и жирные средства запрещены",
    },
    {
      name: "DeepCalm (тепло + вибрация + LED)",
      displayName: "Глубокое расслабление",
      durationMinutes: 7,
      medium: "Проводящий гель или сыворотка на водной основе",
      mediumType: "serum",
      hasElectricCurrent: false,
      ledColor: "жёлтый или фиолетовый — для расслабления",
      steps: [
        { text: "Переключите в режим DeepCalm" },
        { text: "Более медленные, расслабляющие движения" },
        {
          text: "Особое внимание зонам напряжения: челюсть, виски, затылок",
        },
        { text: "Шея и декольте — завершающий дренаж" },
      ],
      note: "Тепло до 45°C — не задерживайтесь долго на одном месте",
    },
  ],
  completionSteps: [
    "Нанесите сыворотку или крем — кожа готова к активам",
    "Утром — SPF как обязательный финал",
  ],
  frequency: {
    timesPerWeek: "daily",
    label: "Ежедневно, 10-20 минут",
    note: "Утренний: ActiveTone (тонус) → DeepCalm (расслабление). Вечерний: ActiveTone (акцент на зоны) → DeepCalm (восстановление)",
  },
  weeklySchedule: "Можно ежедневно. Экспресс-вариант — 5-7 минут",
  canUseDailyLight: true,
  pairsWellWith: ["nuo", "nuo-pro", "anima", "elara"],
  importantRules: [
    "Только водная основа — гель-проводник, сыворотка, лёгкий крем",
    "Масло запрещено — есть микротоки 0,7 мА",
    "Не применять при металлических имплантах в зоне воздействия",
    "Роликовая конструкция — подходит для боковой поверхности шеи",
  ],
};

// ────────────────────────────────────────────
// SYLVA — финальный протокол. Технология WavePulse™: RF + микротоки +
// красный LED 630 нм одновременно в каждом режиме. Единственное устройство
// TOQUE, разрешённое для зоны вокруг глаз.
// ────────────────────────────────────────────

const SYLVA_PROTOCOL: DeviceProtocol = {
  deviceSlug: "sylva",
  category: "ems",
  hasElectricModes: true,
  preparationSteps: [
    "Очистите кожу, промокните полотенцем",
    "Нанесите проводящее средство на водной основе",
    "Гель-проводник, сыворотка или лёгкий крем — на выбор",
  ],
  modes: [
    {
      name: "R-Wave (Relaxation Wave)",
      displayName: "Деликатный уход",
      durationMinutes: 5,
      medium: "Проводящий гель или сыворотка",
      mediumType: "gel",
      hasElectricCurrent: true,
      steps: [
        { text: "Нанесите проводящее средство" },
        { text: "Включите SYLVA — переключите на R-Wave (1 режим)" },
        {
          text: "Начните с зоны вокруг глаз — SYLVA специально рассчитана для этой деликатной зоны",
        },
        {
          text: "Плавные движения вокруг орбиты глаза по направлению к вискам",
        },
        { text: "Лоб: от центра к вискам" },
        { text: "Медленный ритм — режим расслабления" },
      ],
      note: "0,35 мА — самый деликатный режим. Подходит для ежедневного использования и чувствительной кожи",
    },
    {
      name: "T-Wave (Toning Wave)",
      displayName: "Тонизирование",
      durationMinutes: 5,
      medium: "Проводящий гель или сыворотка",
      mediumType: "gel",
      hasElectricCurrent: true,
      steps: [
        { text: "Переключите на T-Wave (2 режим)" },
        { text: "Акцент на контур лица — скулы, овал, подбородок" },
        { text: "Движения снизу вверх по щекам" },
        { text: "Боковая поверхность шеи: снизу вверх" },
      ],
      note: "Основной режим для регулярной проработки контура",
    },
    {
      name: "S-Wave (Sculpting Wave)",
      displayName: "Скульптурирование",
      durationMinutes: 5,
      medium: "Проводящий гель или сыворотка",
      mediumType: "gel",
      hasElectricCurrent: true,
      steps: [
        { text: "Переключите на S-Wave (3 режим)" },
        {
          text: "Точечная проработка зон со сниженным тонусом",
        },
        {
          text: "Угол нижней челюсти, носогубная складка, уголки рта",
        },
        { text: "Ощутимая пульсация — это нормально для S-Wave" },
      ],
      note: "Наиболее интенсивный режим (0,40 мА). Начинайте с R-Wave и T-Wave — переходите к S-Wave после нескольких сеансов",
    },
  ],
  completionSteps: [
    "Остатки проводящего средства распределите по коже",
    "Нанесите крем",
    "Утром — SPF",
  ],
  frequency: {
    timesPerWeek: "daily",
    label: "Ежедневно",
    note: "R-Wave и T-Wave — ежедневно. S-Wave — 2-3 раза в неделю",
  },
  weeklySchedule: "Утром — R+T (10 мин). Вечером — R+T+S (15-20 мин)",
  canUseDailyLight: true,
  pairsWellWith: ["nuo", "nuo-pro", "anima", "lyra"],
  importantRules: [
    "Только водная основа — RF + микротоки во всех режимах",
    "Масло запрещено во всех режимах",
    "Единственное устройство TOQUE, разрешённое для зоны вокруг глаз",
    "Автотаймер 5 минут — переключайте режим после сигнала",
    "Начинайте с R-Wave, S-Wave вводите постепенно",
  ],
};

export const deviceProtocols: DeviceProtocol[] = [
  NUO_PROTOCOL,
  NUO_PRO_PROTOCOL,
  LUMERA_PROTOCOL,
  ELARA_PROTOCOL,
  PULSAR_PROTOCOL,
  ANIMA_PROTOCOL,
  AURA_PROTOCOL,
  NOVA_PROTOCOL,
  AERIS_PROTOCOL,
  QUANTUM_PROTOCOL,
  VIBE_PROTOCOL,
  LYRA_PROTOCOL,
  SYLVA_PROTOCOL,
];

export function getProtocolBySlug(slug: string): DeviceProtocol | undefined {
  return deviceProtocols.find((p) => p.deviceSlug === slug);
}

export function getModeByName(
  protocol: DeviceProtocol,
  modeName: string,
): ProcedureMode | undefined {
  return protocol.modes.find((m) => m.name === modeName);
}

// ────────────────────────────────────────────
// Готовые дневные протоколы для LYRA и SYLVA (экран /ritual — выбор
// «Утренний / Вечерний / Экспресс» перед началом процедуры).
// ────────────────────────────────────────────

export type DailyProtocol = {
  name: string;
  totalMinutes: number;
  sequence: string[];
};

export type DailyProtocolKey = "morning" | "evening" | "express";

export const lyraProtocols: Record<DailyProtocolKey, DailyProtocol> = {
  morning: {
    name: "Утренний · тонус и свежесть",
    totalMinutes: 15,
    sequence: [
      "Очищение — промокните полотенцем",
      "Проводящее средство — гель или сыворотка",
      "ActiveTone + красный или зелёный LED — 5 мин",
      "DeepCalm + жёлтый LED — 5 мин",
      "Крем + SPF",
    ],
  },
  evening: {
    name: "Вечерний · расслабление и восстановление",
    totalMinutes: 20,
    sequence: [
      "Двойное очищение",
      "Проводящее средство",
      "ActiveTone + красный LED — 5-7 мин, акцент на тонус",
      "DeepCalm + фиолетовый или синий LED — 5-7 мин",
      "Ночной крем или восстанавливающая сыворотка",
    ],
  },
  express: {
    name: "Экспресс · перед выходом",
    totalMinutes: 7,
    sequence: [
      "Очищение + проводящее средство",
      "DeepCalm + зелёный LED — 3-4 мин (микроциркуляция)",
      "ActiveTone + жёлтый LED — 2-3 мин (контур)",
      "SPF",
    ],
  },
};

export const sylvaProtocols: Record<DailyProtocolKey, DailyProtocol> = {
  morning: {
    name: "Утренний · тонус и свежесть",
    totalMinutes: 15,
    sequence: [
      "Очищение + проводящее средство",
      "R-Wave — 5 мин (зона глаз и лоб)",
      "T-Wave — 5 мин (контур лица)",
      "Крем + SPF",
    ],
  },
  evening: {
    name: "Вечерний · активная проработка",
    totalMinutes: 20,
    sequence: [
      "Двойное очищение + проводящее средство",
      "R-Wave — 5 мин (зона вокруг глаз)",
      "T-Wave — 5 мин (контур лица)",
      "S-Wave — 5 мин (точечные зоны)",
      "Ночной крем",
    ],
  },
  express: {
    name: "Экспресс · 5-7 минут",
    totalMinutes: 7,
    sequence: [
      "Очищение + проводящее средство",
      "R-Wave — 2-3 мин (зона глаз)",
      "T-Wave — 3-4 мин (контур)",
      "SPF",
    ],
  },
};

// Моё дополнение к тому, что дал заказчик: sequence выше — это текст для
// человека («ActiveTone + красный LED — 5 мин»), а не структурированная
// ссылка на конкретный режим из modes[]. Чтобы /ritual мог показать
// предупреждение про средство (Блок 6) для КАЖДОГО реального режима внутри
// выбранного дневного протокола — а не только текстом — сопоставляю имя
// дневного шага с реальным ProcedureMode.name из LYRA_PROTOCOL/SYLVA_PROTOCOL.
export const lyraDailyModeSequence: Record<DailyProtocolKey, string[]> = {
  morning: ["ActiveTone (микротоки + LED)", "DeepCalm (тепло + вибрация + LED)"],
  evening: ["ActiveTone (микротоки + LED)", "DeepCalm (тепло + вибрация + LED)"],
  express: ["DeepCalm (тепло + вибрация + LED)", "ActiveTone (микротоки + LED)"],
};

export const sylvaDailyModeSequence: Record<DailyProtocolKey, string[]> = {
  morning: ["R-Wave (Relaxation Wave)", "T-Wave (Toning Wave)"],
  evening: [
    "R-Wave (Relaxation Wave)",
    "T-Wave (Toning Wave)",
    "S-Wave (Sculpting Wave)",
  ],
  express: ["R-Wave (Relaxation Wave)", "T-Wave (Toning Wave)"],
};
