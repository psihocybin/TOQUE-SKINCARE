// Средства TOQUE CARE для аппаратных процедур. Отдельно от devices.ts:
// это не устройства — они не участвуют в квизе, ритуалах и программе,
// только показываются в каталоге со ссылкой на магазин.
export type CareProduct = {
  slug: string;
  name: string;
  subtitle: string;
  imageUrl: string;
  url: string;
};

export const careProducts: CareProduct[] = [
  {
    slug: "gel-uz",
    name: "Гель для УЗ-чистки",
    subtitle: "150 мл · для NUO, NUO PRO, LUMERA",
    imageUrl: "/devices/gel-uz.jpg",
    url: "https://toque-store.ru/products/gel-dlya-ultrazvukovoy-chistki-toque-care-100057",
  },
  {
    slug: "gel-ems",
    name: "Гель-проводник для RF и EMS",
    subtitle: "150 мл · для ELARA, PULSAR и микротоков",
    imageUrl: "/devices/gel-ems.jpg",
    url: "https://toque-store.ru/products/gel-dlya-rf-i-ems-procedur-toque-care-100035",
  },
];
