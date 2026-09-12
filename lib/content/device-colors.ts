import type { CSSProperties } from "react";

// Раскраска по устройству — для конструктора ритуала, мини-календарей и
// недельного календаря /ritual-home. Отдельная от общей палитры TOQUE
// (olive/cream/rose) осознанно: нужно одновременно отличать на глаз до 13
// разных приборов, двух-трёх акцентных цветов бренда для этого мало
// (тот же подход виден в референсе Medicube — у каждого прибора свой цвет).
export type DeviceColor = {
  bg: string; // tailwind-класс фона (для тегов/бейджей)
  text: string; // tailwind-класс текста
  border: string; // tailwind-класс бордера
  hex: string; // сырой hex — сохраняется в rituals.schedule и используется в SVG/inline-стилях
};

const DEVICE_COLORS: Record<string, DeviceColor> = {
  nuo: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300", hex: "#93C5FD" },
  "nuo-pro": { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300", hex: "#93C5FD" },
  lumera: { bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-300", hex: "#A5B4FC" },
  elara: { bg: "bg-olive/15", text: "text-olive", border: "border-olive/40", hex: "#7A8A4F" },
  pulsar: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300", hex: "#86EFAC" },
  anima: { bg: "bg-rose-100", text: "text-rose-600", border: "border-rose-300", hex: "#FDA4AF" },
  aura: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300", hex: "#FCD34D" },
  nova: { bg: "bg-teal-100", text: "text-teal-700", border: "border-teal-300", hex: "#5EEAD4" },
  aeris: { bg: "bg-cyan-100", text: "text-cyan-700", border: "border-cyan-300", hex: "#67E8F9" },
  quantum: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300", hex: "#C4B5FD" },
  vibe: { bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-300", hex: "#F9A8D4" },
  lyra: { bg: "bg-violet-100", text: "text-violet-700", border: "border-violet-300", hex: "#DDD6FE" },
  sylva: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300", hex: "#6EE7B7" },
};

const DEFAULT_DEVICE_COLOR: DeviceColor = {
  bg: "bg-black/6",
  text: "text-text-muted",
  border: "border-black/15",
  hex: "#B7B6AE",
};

export function getDeviceColor(deviceSlug: string): DeviceColor {
  return DEVICE_COLORS[deviceSlug] ?? DEFAULT_DEVICE_COLOR;
}

// Плоские пастельные bg/border (DeviceColor.bg/.border) читаются на сплошном
// cream-фоне, но на фото-подложке (см. PhoneFrame) выглядят почти белыми и
// теряются. Для выделенных состояний вместо плоского цвета берём настоящее
// полупрозрачное "стекло" — сам цвет устройства (color.hex) с alpha,
// поверх которого нужен backdrop-blur на элементе.
export function deviceGlassStyle(hex: string): CSSProperties {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return {
    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.3)`,
    borderColor: `rgba(${r}, ${g}, ${b}, 0.6)`,
  };
}

// Короткие подписи для тегов режимов в мини-календарях — displayName из
// protocols.ts обычно слишком длинный для таблетки шириной в одну ячейку
// недели. Перенесено из lib/ritual-builder/device-colors.ts (retired) —
// единственная часть того файла, не связанная с раскраской по устройству.
const MODE_ABBREVIATIONS: Record<string, string> = {
  Очищение: "Очищ.",
  Лифтинг: "Лифт.",
  "Глубокая чистка": "Глуб.ч.",
  Ионофорез: "Ионф.",
  "Активный тонус": "АктТон",
  "Глубокое расслабление": "ГлубРасс",
  "Массаж глаз": "Глаза",
  "Деликатный уход": "Делик.",
  Тонизирование: "Тонус",
  Скульптурирование: "Скульпт",
  "Световая терапия": "Свет",
  "Ручной массаж": "Ручн.",
  "Уход за кожей головы": "Скальп",
  "Перкуссионный массаж": "Перк.",
  "Микромассаж + красный LED": "Микром.",
  "Нагрев + красный LED": "Нагрев",
  "Нагрев + микротоки": "Микрот.",
};

export function abbreviateMode(displayName: string): string {
  return (
    MODE_ABBREVIATIONS[displayName] ??
    (displayName.length > 6 ? `${displayName.slice(0, 5)}.` : displayName)
  );
}
