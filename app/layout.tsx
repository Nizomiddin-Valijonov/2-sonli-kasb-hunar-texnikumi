import "./globals.css";
import type { Metadata } from "next";
import { Rubik } from "next/font/google";

const rubikSans = Rubik({
  variable: "--font-rubik-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "2-son Kasb-hunar kolleji – Rasmiy veb-sayt",
  description:
    "2-son kasb-hunar kolleji – zamonaviy kasblarni o‘rganish, amaliy bilim va malaka olish maskani. Yo‘nalishlar, yangiliklar va qabul haqida batafsil ma’lumot.",
  keywords: [
    "2-son kasb-hunar kolleji",
    "kollej",
    "kasb-hunar",
    "ta’lim",
    "uzbekistan college",
    "texnikum",
    "kasb o‘rganish",
    "talabalar",
    "amaliy ta’lim",
  ],
  authors: [{ name: "Nizomiddin Valijanov" }],
  creator: "2-son kasb-hunar kolleji",
  publisher: "2-son kasb-hunar kolleji",

  openGraph: {
    title: "2-son Kasb-hunar kolleji – Rasmiy veb-sayt",
    description:
      "Kasb egallashni istaganlar uchun eng to‘g‘ri tanlov. Yo‘nalishlar, o‘quv jarayoni va yangiliklar bilan tanishing.",
    url: "https://2-kollej.uz",
    siteName: "2-son kasb-hunar kolleji",
    images: [
      {
        url: "/gerb.svg",
        width: 1200,
        height: 630,
        alt: "2-son kasb-hunar kolleji",
      },
    ],
    locale: "uz_UZ",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "2-son Kasb-hunar kolleji",
    description:
      "Zamonaviy kasblar, amaliy bilim va real natija. Kollej hayoti va yangiliklari bilan tanishing.",
    images: ["/og-image.jpg"],
    creator: "@2kollej",
  },

  icons: {
    icon: "/gerb.svg",
    apple: "/gerb.svg",
  },

  manifest: "/site.webmanifest",
  metadataBase: new URL("https://2-kollej.uz"),

  alternates: {
    canonical: "https://2-kollej.uz",
    languages: {
      "uz-UZ": "https://2-kollej.uz/uz",
      "ru-RU": "https://2-kollej.uz/ru",
      "en-US": "https://2-kollej.uz/en",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <head>
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={rubikSans.variable}>{children}</body>
    </html>
  );
}
