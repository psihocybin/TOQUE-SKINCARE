export type Device = {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  promoCode: string;
  category: "cleansing" | "tone" | "led" | "eyes" | "scalp" | "body";
  pairsWith: string[];
  comboProtocol: string;
  url: string;
  // Путь к фото устройства в public/devices/. Пока папка пустая — все
  // устройства без фото, DeviceImage показывает плейсхолдер (первая буква).
  // См. docs/ADDING_DEVICE_PHOTOS.md.
  imageUrl?: string;
};

export const devices: Device[] = [
  {
    slug: "nuo",
    imageUrl: "/devices/nuo.jpg",
    name: "NUO",
    subtitle: "Ультразвуковая чистка · 4 режима",
    description:
      "Базовый УЗ-скрабер для домашней чистки. Мягко удаляет загрязнения из пор, уменьшает количество чёрных точек, усиливает действие сывороток через ионофорез. Подходит для старта в аппаратном уходе.",
    promoCode: "TOQUERITUAL15",
    category: "cleansing",
    pairsWith: ["elara", "anima"],
    comboProtocol:
      "NUO очищает поры, ELARA тонизирует мышцы. 5 + 8 минут — полный протокол лица.",
    url: "https://toque-store.ru/products/ultrazvukovoy-apparat-dlya-chistki-litsa-toque-nuo-100060",
  },
  {
    slug: "nuo-pro",
    imageUrl: "/devices/nuo-pro.jpg",
    name: "NUO PRO",
    subtitle: "Ультразвуковая чистка · с дόк-станцией",
    description:
      "Расширенная версия NUO с зарядной дόк-станцией и усиленным EMS-режимом. Те же 4 режима полного протокола, но удобнее в ежедневном использовании — всегда заряжен на стенде.",
    promoCode: "TOQUERITUAL15",
    category: "cleansing",
    pairsWith: ["elara", "anima"],
    comboProtocol:
      "NUO PRO + ELARA: очищение и тонизирование лица за одну вечернюю процедуру.",
    url: "https://toque-store.ru/products/ultrazvukovoy-apparat-dlya-chistki-litsa-toque-nuo-pro-s-gelem-100059",
  },
  {
    slug: "lumera",
    imageUrl: "/devices/lumera.jpg",
    name: "LUMERA",
    subtitle: "УЗ + LED-терапия · 4 режима",
    description:
      "Ультразвуковая чистка с LED-терапией в каждом режиме: УЗ + красный свет, дезинкрустация + жёлтый, ионофорез + синий, EMS + ИК. Для тех, кто хочет одновременно чистить поры и работать с тоном кожи.",
    promoCode: "TOQUERITUAL15",
    category: "cleansing",
    pairsWith: ["elara"],
    comboProtocol:
      "LUMERA + ELARA: чистка со световой терапией и EMS-лифтинг — комплексный протокол за 15 минут.",
    url: "https://toque-store.ru/products/toque-lumera-ultrazvukovaya-chistka-litsa-led-ems-100058",
  },
  {
    slug: "elara",
    imageUrl: "/devices/elara.jpg",
    name: "ELARA",
    subtitle: "EMS-лифтинг · RF · LED",
    description:
      "Специализированный аппарат для тонуса и овала лица. EMS до 9 мА — выше, чем у большинства домашних устройств. RF-прогрев создаёт условия для поддержки плотности кожи, LED в двух режимах. Для тех, кому важен именно лифтинг.",
    promoCode: "TOQUERITUAL15",
    category: "tone",
    pairsWith: ["nuo", "nuo-pro", "lumera"],
    comboProtocol:
      "Используйте NUO/NUO PRO для очищения, ELARA — в дни между процедурами для тонизирования.",
    url: "https://toque-store.ru/products/ems-massazher-dlya-litsa-toque-elara-mikrotoki-rf-100045",
  },
  {
    slug: "pulsar",
    imageUrl: "/devices/pulsar.jpg",
    name: "PULSAR",
    subtitle: "EMS · RF · LED · 7 в 1",
    description:
      "Многофункциональный массажёр: EMS, RF-лифтинг, электропорация, LED в трёх спектрах, криокомпресс, вибромассаж, ИК-нагрев. Полный протокол домашнего ухода в одном устройстве — для тех, кто хочет охватить сразу несколько задач.",
    promoCode: "TOQUERITUAL15",
    category: "tone",
    pairsWith: ["nuo"],
    comboProtocol:
      "NUO очищает, PULSAR завершает протокол: тонус, лимфодренаж и уход за кожей за 10 минут.",
    url: "https://toque-store.ru/products/pulsar-ems-rf-100062",
  },
  {
    slug: "anima",
    imageUrl: "/devices/anima.jpg",
    name: "ANIMA",
    subtitle: "LED-маска · 8 спектров · NIR 850 нм",
    description:
      "Профессиональная световая терапия дома. 66 LED-модулей, 8 спектров включая ближний инфракрасный NIR 850 нм. Красный свет поддерживает регенерацию, синий — работает с воспалениями, NIR проникает глубже всех спектров. 15 минут лёжа.",
    promoCode: "TOQUERITUAL15",
    category: "led",
    pairsWith: ["nuo", "nuo-pro"],
    comboProtocol:
      "Сначала NUO для очищения — потом ANIMA: подготовленная кожа лучше реагирует на световую терапию.",
    url: "https://toque-store.ru/products/led-maska-dlya-lica-anima-100064",
  },
  {
    slug: "aura",
    imageUrl: "/devices/aura.jpg",
    name: "AURA",
    subtitle: "Гуаша · микромассаж · микротоки · прогрев · LED",
    description:
      "Электрический массажёр гуаша с 6 режимами. В режимах 1-4: микромассаж и прогрев с LED — масло и кремы. В режиме 5: нагрев + микротоки 0,22 мА для усиления впитывания активов — только водная основа. Лицо, шея, декольте, 5-10 минут ежедневно.",
    promoCode: "TOQUERITUAL15",
    category: "tone",
    pairsWith: ["nuo", "nuo-pro", "elara", "anima"],
    comboProtocol:
      "NUO очищает, AURA — ежедневный поддерживающий массаж для лимфодренажа и тонуса.",
    url: "https://toque-store.ru/products/massajer-dlya-lica-i-shei-skrebok-guasha-100046",
  },
  {
    slug: "nova",
    imageUrl: "/devices/nova.jpg",
    name: "NOVA",
    subtitle: "Массаж глаз · прогрев · вибрация",
    description:
      "Массажные очки для глаз с подогревом 40–42 °C и вибромассажем, 5 режимов. Снимают напряжение круговой мышцы глаза и усталость от экранов. Bluetooth, автотаймер 15 минут — надел и занимайся своими делами.",
    promoCode: "TOQUERITUAL15",
    category: "eyes",
    pairsWith: ["nuo"],
    comboProtocol:
      "После процедуры NUO — 15 минут с NOVA: полный уход за лицом, включая зону глаз.",
    url: "https://toque-store.ru/products/massazhnye-ochki-dlya-glaz-nova-100047",
  },
  {
    slug: "aeris",
    imageUrl: "/devices/aeris.jpg",
    name: "AERIS",
    subtitle: "Массаж глаз · компрессия · 8 зон",
    description:
      "Массажные очки с воздушно-компрессионным массажем в 8 зонах, 3 режима. Работают с отёчностью и усталостью периорбитальной зоны. Отличие от NOVA: компрессия вместо вибрации — интенсивнее для тех, кто работает за экраном по 8+ часов.",
    promoCode: "TOQUERITUAL15",
    category: "eyes",
    pairsWith: ["nuo"],
    comboProtocol:
      "AERIS + NUO: очищение кожи и снятие усталости глаз — утренний или вечерний ритуал за 20 минут.",
    url: "https://toque-store.ru/products/massazhnye-ochki-dlya-glaz-aeris-100065",
  },
  {
    slug: "quantum",
    imageUrl: "/devices/quantum.jpg",
    name: "QUANTUM",
    subtitle: "EMS-расчёска · кожа головы и тело",
    description:
      "EMS-расчёска для кожи головы, лица, шеи и тела. Микротоки, вибромассаж, нагрев, ИК-свет 850 нм. 4 сменные насадки и резервуар для сыворотки в гребне. Поддерживает микроциркуляцию и питание волосяных фолликулов.",
    promoCode: "TOQUERITUAL15",
    category: "scalp",
    pairsWith: [],
    comboProtocol:
      "QUANTUM — отдельная зона ухода (кожа головы). Не требует сочетания с другими устройствами.",
    url: "https://toque-store.ru/products/quantum-ems-rascheska-100063",
  },
  {
    slug: "vibe",
    imageUrl: "/devices/vibe.jpg",
    name: "VIBE",
    subtitle: "Перкуссионный массажёр · 3200 уд/мин",
    description:
      "Перкуссионный массажёр для лица, шеи, кожи головы и тела. 3200 ударов в минуту, амплитуда 6 мм, 4 скорости, 6 насадок. Снимает мышечное напряжение и помогает ускорить восстановление. Из категории тела, а не только лица.",
    promoCode: "TOQUERITUAL15",
    category: "body",
    pairsWith: [],
    comboProtocol:
      "VIBE — самостоятельный инструмент для тела. Хорошо дополняет ритуал после физической активности.",
    url: "https://toque-store.ru/products/vibe-massager-100061",
  },
  {
    slug: "lyra",
    imageUrl: "/devices/lyra.jpg",
    name: "LYRA",
    subtitle: "DualCare™ · микротоки · прогрев · LED 5 спектров",
    description:
      "Микротоковый массажёр 0,7 мА с технологией DualCare™. ActiveTone — микротоки + LED (5 спектров) для тонуса мышц. DeepCalm — тепло + вибрация + LED для расслабления. Лицо, шея, декольте. Ежедневно 10-15 минут.",
    promoCode: "TOQUERITUAL15",
    category: "tone",
    pairsWith: ["nuo", "nuo-pro", "anima", "elara"],
    comboProtocol:
      "NUO очищает, LYRA работает с микротоками на подготовленной коже.",
    url: "https://toque-store.ru/products/lyra",
  },
  {
    slug: "sylva",
    imageUrl: "/devices/sylva.jpg",
    name: "SYLVA",
    subtitle: "WavePulse™ · RF + микротоки · красный LED",
    description:
      "Массажёр для RF-лифтинга и микротоковой стимуляции. 3 режима WavePulse™: R-Wave (расслабление), T-Wave (тонус), S-Wave (скульптурирование). LED 630 нм — 36 мВт/см² (клинический уровень). Единственное устройство TOQUE для зоны вокруг глаз.",
    promoCode: "TOQUERITUAL15",
    category: "tone",
    pairsWith: ["nuo", "nuo-pro", "anima", "lyra"],
    comboProtocol:
      "NUO очищает, SYLVA прорабатывает контур и зону вокруг глаз микротоками.",
    url: "https://toque-store.ru/products/sylva",
  },
];

export function getDeviceBySlug(slug: string): Device | undefined {
  return devices.find((d) => d.slug === slug);
}

// Профиль хранит device как enum ("NUO", "NUO_PRO", …). Slug — lowercase с дефисом
// вместо подчёркивания.
export function deviceEnumToSlug(deviceEnum: string): string {
  return deviceEnum.toLowerCase().replace(/_/g, "-");
}
