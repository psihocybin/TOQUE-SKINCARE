"use client";

import { useState } from "react";
import { BackButton } from "@/components/shared/back-button";
import { OptionTile } from "@/components/shared/option-tile";
import { ChipGroup } from "@/components/shared/chip-group";
import { ProgressBar } from "@/components/quiz/progress-bar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const swatches = [
  { name: "olive", className: "bg-olive" },
  { name: "olive-dark", className: "bg-olive-dark" },
  { name: "olive-light", className: "bg-olive-light" },
  { name: "cream", className: "bg-cream" },
  { name: "cream-dark", className: "bg-cream-dark" },
  { name: "rose", className: "bg-rose" },
  { name: "text", className: "bg-text" },
  { name: "text-muted", className: "bg-text-muted" },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-[10px] uppercase tracking-[1.5px] text-text-muted">
      {children}
    </h2>
  );
}

export default function DesignTestPage() {
  const [age, setAge] = useState("35-44");
  const [time, setTime] = useState("morning");

  return (
    <>
      <header className="relative flex h-12 items-center justify-center border-b border-black/8 px-4">
        <div className="absolute left-4">
          <BackButton href="/splash" />
        </div>
        <span className="text-sm font-medium text-text">Дизайн-система</span>
      </header>

      <div className="space-y-9 px-5 py-7">
        <section>
          <SectionTitle>1 · Палитра</SectionTitle>
          <div className="flex flex-wrap gap-3">
            {swatches.map((swatch) => (
              <div
                key={swatch.name}
                className="flex w-[64px] flex-col items-center gap-1.5"
              >
                <div
                  className={`h-12 w-12 rounded-md ring-1 ring-black/10 ${swatch.className}`}
                />
                <span className="text-center text-[9px] leading-tight text-text-muted">
                  {swatch.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>2 · Типографика</SectionTitle>
          <div className="space-y-2">
            <h1 className="text-[32px] font-bold leading-tight text-olive-dark">
              Заголовок первого уровня
            </h1>
            <h2 className="text-[24px] font-bold leading-tight text-olive">
              Заголовок второго уровня
            </h2>
            <p className="text-base text-text">
              Основной текст приложения TOQUE Ритуал
            </p>
            <p className="text-xs text-text-muted">Подпись мелким текстом</p>
            <p className="font-mono text-sm text-text">
              ANNA-2025-N7 · TQ-NUO-04823
            </p>
          </div>
        </section>

        <section>
          <SectionTitle>3 · Кнопки</SectionTitle>
          <div className="flex flex-wrap gap-2">
            <Button>Начать</Button>
            <Button variant="secondary">Отмена</Button>
            <Button variant="outline">Подробнее</Button>
            <Button disabled>Недоступно</Button>
          </div>
        </section>

        <section>
          <SectionTitle>4 · OptionTile</SectionTitle>
          <div className="space-y-2">
            <OptionTile
              label="25–34 года"
              selected={age === "25-34"}
              onClick={() => setAge("25-34")}
            />
            <OptionTile
              label="35–44 года"
              selected={age === "35-44"}
              onClick={() => setAge("35-44")}
            />
            <OptionTile
              label="45–54 года"
              selected={age === "45-54"}
              onClick={() => setAge("45-54")}
            />
          </div>
        </section>

        <section>
          <SectionTitle>5 · ChipGroup</SectionTitle>
          <ChipGroup
            options={[
              { value: "morning", label: "Утром" },
              { value: "evening", label: "Вечером" },
              { value: "flexible", label: "Гибко" },
            ]}
            selected={time}
            onChange={setTime}
          />
        </section>

        <section>
          <SectionTitle>6 · ProgressBar</SectionTitle>
          <ProgressBar currentStep={3} totalSteps={6} />
        </section>

        <section>
          <SectionTitle>7 · Карточки</SectionTitle>
          <div className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-[11px] uppercase tracking-[1.5px] text-text-muted">
                  Сегодня
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text">
                  Очищение ультразвуком — 5 минут. Мягко, по массажным линиям.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Начать ритуал</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[11px] uppercase tracking-[1.5px] text-text-muted">
                  Совет дня
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text">
                  Регулярность важнее интенсивности. Видимое улучшение даёт
                  спокойный ежедневный протокол.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
