import {
  getModeByName,
  getProtocolBySlug,
  type ProcedureMode,
} from "@/lib/content/protocols";

export type TutorialStep = {
  title: string;
  description: string;
  imagePlaceholder?: string;
  isImportant?: boolean;
};

export type Tutorial = {
  id: string;
  deviceSlug: string;
  title: string;
  description: string;
  durationMinutes: number;
  thumbnailPlaceholder: string;
  steps: TutorialStep[];
  tags: string[];
};

// Шаги туториала строятся из реальных ProcedureMode.steps в protocols.ts —
// не дублируем текст руками, чтобы не разойтись при будущих правках
// протокола. Заголовок карточки шага — сам текст инструкции (это и есть
// содержательная часть), описание под ней — note режима (если есть),
// isImportant — если в режиме работает ток (нужна вода, не масло).
function stepsFromModes(deviceSlug: string, modeNames: string[]): TutorialStep[] {
  const protocol = getProtocolBySlug(deviceSlug);
  if (!protocol) return [];
  const modes = modeNames
    .map((name) => getModeByName(protocol, name))
    .filter((m): m is ProcedureMode => Boolean(m));
  return modes.flatMap((mode) =>
    mode.steps.map((step) => ({
      title: step.text,
      description: mode.note ?? "",
      isImportant: mode.hasElectricCurrent,
    })),
  );
}

const PLACEHOLDER_TONES = ["bg-cream-dark", "bg-olive/8", "bg-rose/8"] as const;
function toneFor(index: number): string {
  return PLACEHOLDER_TONES[index % PLACEHOLDER_TONES.length] ?? PLACEHOLDER_TONES[0];
}

export const tutorials: Tutorial[] = [
  {
    id: "nuo-cleaning",
    deviceSlug: "nuo",
    title: "Ультразвуковое очищение",
    description: "Мягкое УЗ-очищение пор на влажной коже, гель-проводник.",
    durationMinutes: 5,
    thumbnailPlaceholder: toneFor(0),
    steps: stepsFromModes("nuo", ["Cleaning (УЗ-очищение)"]),
    tags: ["nuo"],
  },
  {
    id: "nuo-ion-minus",
    deviceSlug: "nuo",
    title: "Дезинкрустация пор",
    description: "Глубокая чистка расширенных пор гальваническим током.",
    durationMinutes: 5,
    thumbnailPlaceholder: toneFor(1),
    steps: stepsFromModes("nuo", ["Ion- (дезинкрустация)"]),
    tags: ["nuo"],
  },
  {
    id: "nuo-ion-plus",
    deviceSlug: "nuo",
    title: "Ионофорез: доставка активов",
    description: "Усиленное проникновение сыворотки с активными компонентами.",
    durationMinutes: 8,
    thumbnailPlaceholder: toneFor(2),
    steps: stepsFromModes("nuo", ["Ion+ (ионофорез)"]),
    tags: ["nuo"],
  },
  {
    id: "nuo-lifting",
    deviceSlug: "nuo",
    title: "Микротоковый лифтинг",
    description: "Проработка овала лица микротоками, водная основа.",
    durationMinutes: 8,
    thumbnailPlaceholder: toneFor(0),
    steps: stepsFromModes("nuo", ["Lifting (микротоки)"]),
    tags: ["nuo"],
  },
  {
    id: "elara-red",
    deviceSlug: "elara",
    title: "RED-режим: лифтинг и тонус",
    description: "Протокол уточняется — появится после проверки у специалиста.",
    durationMinutes: 10,
    thumbnailPlaceholder: toneFor(1),
    steps: [],
    tags: ["elara"],
  },
  {
    id: "elara-blue",
    deviceSlug: "elara",
    title: "BLUE-режим: баланс и поры",
    description: "Протокол уточняется — появится после проверки у специалиста.",
    durationMinutes: 7,
    thumbnailPlaceholder: toneFor(2),
    steps: [],
    tags: ["elara"],
  },
  {
    id: "lyra-activetone",
    deviceSlug: "lyra",
    title: "ActiveTone: утренний тонус",
    description: "Микротоки 0,7 мА + LED — тонус и чёткость контура с утра.",
    durationMinutes: 10,
    thumbnailPlaceholder: toneFor(0),
    steps: stepsFromModes("lyra", ["ActiveTone (микротоки + LED)"]),
    tags: ["lyra"],
  },
  {
    id: "lyra-deepcalm",
    deviceSlug: "lyra",
    title: "DeepCalm: вечернее расслабление",
    description: "Тепло, вибрация и LED — расслабление без тока перед сном.",
    durationMinutes: 10,
    thumbnailPlaceholder: toneFor(1),
    steps: stepsFromModes("lyra", ["DeepCalm (тепло + вибрация + LED)"]),
    tags: ["lyra"],
  },
  {
    id: "sylva-basic",
    deviceSlug: "sylva",
    title: "R-Wave + T-Wave: базовый протокол",
    description: "Деликатный уход вокруг глаз и тонизирование контура лица.",
    durationMinutes: 10,
    thumbnailPlaceholder: toneFor(2),
    steps: stepsFromModes("sylva", [
      "R-Wave (Relaxation Wave)",
      "T-Wave (Toning Wave)",
    ]),
    tags: ["sylva"],
  },
  {
    id: "sylva-full-evening",
    deviceSlug: "sylva",
    title: "Полный вечерний протокол",
    description: "R-Wave, T-Wave и S-Wave — расслабление, тонус, скульптурирование.",
    durationMinutes: 20,
    thumbnailPlaceholder: toneFor(0),
    steps: stepsFromModes("sylva", [
      "R-Wave (Relaxation Wave)",
      "T-Wave (Toning Wave)",
      "S-Wave (Sculpting Wave)",
    ]),
    tags: ["sylva"],
  },
  {
    id: "anima-light-therapy",
    deviceSlug: "anima",
    title: "Световая терапия: выбор спектра",
    description: "8 спектров LED — как подобрать под задачу кожи сегодня.",
    durationMinutes: 15,
    thumbnailPlaceholder: toneFor(1),
    steps: stepsFromModes("anima", ["LED-сессия"]),
    tags: ["anima"],
  },
  {
    id: "aura-technique",
    deviceSlug: "aura",
    title: "Гуаша: техника движений",
    description: "Базовая техника массажных линий для лица, шеи и декольте.",
    durationMinutes: 10,
    thumbnailPlaceholder: toneFor(2),
    steps: stepsFromModes("aura", ["Микромассаж + красный LED"]),
    tags: ["aura"],
  },
  {
    id: "nova-eye-massage",
    deviceSlug: "nova",
    title: "Массаж глаз",
    description: "Массажные очки с подогревом и вибрацией — снятие напряжения.",
    durationMinutes: 15,
    thumbnailPlaceholder: toneFor(0),
    steps: stepsFromModes("nova", ["Массаж вокруг глаз"]),
    tags: ["nova"],
  },
  {
    id: "aeris-eye-massage",
    deviceSlug: "aeris",
    title: "Массаж глаз",
    description: "Воздушно-компрессионный массаж 8 зон — работа с отёчностью.",
    durationMinutes: 15,
    thumbnailPlaceholder: toneFor(1),
    steps: stepsFromModes("aeris", ["Массаж вокруг глаз"]),
    tags: ["aeris"],
  },
];

export function getTutorialById(id: string): Tutorial | undefined {
  return tutorials.find((t) => t.id === id);
}

export function getTutorialsByDevice(deviceSlug: string): Tutorial[] {
  return tutorials.filter((t) => t.deviceSlug === deviceSlug);
}

// NUO PRO использует тот же УЗ-протокол, что и NUO — отдельных туториалов
// для него нет, поэтому в UI туториалы NUO помечаются как общие для обеих
// версий устройства, а не заводится дублирующий набор карточек.
export function tutorialDeviceLabel(deviceSlug: string, fallback: string): string {
  if (deviceSlug === "nuo") return "NUO/NUO PRO";
  return fallback;
}
