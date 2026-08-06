import type { SkinType } from "@/lib/quiz/quiz-context";

export type SkinTypeOption = {
  value: SkinType;
  label: string;
  description: string;
  swatch: string;
};

export const SKIN_TYPE_OPTIONS: SkinTypeOption[] = [
  {
    value: "normal",
    label: "Нормальная",
    description: "Без выраженных проблем",
    swatch: "#E8D5C4",
  },
  {
    value: "dry",
    label: "Сухая",
    description: "Стянутость, шелушение",
    swatch: "#D4B5A0",
  },
  {
    value: "oily",
    label: "Жирная",
    description: "Расширенные поры, блеск",
    swatch: "#C4D4A8",
  },
  {
    value: "combo",
    label: "Комбинированная",
    description: "Жирная T-зона, нормальные щёки",
    swatch: "linear-gradient(90deg, #D4B5A0 50%, #C4D4A8 50%)",
  },
  {
    value: "sensitive",
    label: "Чувствительная",
    description: "Покраснения, реакции",
    swatch: "#F0C4C4",
  },
];

export function getSkinTypeOption(value: SkinType): SkinTypeOption | undefined {
  return SKIN_TYPE_OPTIONS.find((o) => o.value === value);
}
