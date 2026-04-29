import "./globals.css";
import type { Metadata } from "next";
import { Rubik } from "next/font/google";

const rubikSans = Rubik({
  variable: "--font-rubik-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "84-maktab – Rasmiy veb-sayt",
  description:
    "84-maktab – yosh avlod uchun bilim va ma’naviyat maskani. O‘quvchilar uchun yangiliklar, tadbirlar, ta’lim muhitidan xabardor bo‘ling.",
  keywords: [
    "84-maktab",
    "maktab",
    "Uzbekistan school",
    "ta’lim",
    "maktab yangiliklari",
    "o‘quvchilar",
    "uzedu",
  ],
  authors: [{ name: "Nizomiddin Valijanov" }],
  creator: "84-maktab",
  publisher: "84-maktab",
  openGraph: {
    title: "84-maktab – Rasmiy veb-sayt",
    description:
      "Bilim va ma’naviyat maskani. Maktab yangiliklari, tadbirlar va ta’lim jarayoni haqida batafsil ma’lumot.",
    url: "https://nam-school84.uz",
    siteName: "84-maktab",
    images: [
      {
        url: "/gerb.svg",
        width: 1200,
        height: 630,
        alt: "84-maktab",
      },
    ],
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "84-maktab – Rasmiy veb-sayt",
    description:
      "84-maktab – yosh avlod uchun bilim va ma’naviyat maskani. Yangiliklar va tadbirlar bilan tanishing.",
    images: ["/og-image.jpg"],
    creator: "@33maktab",
  },
  icons: {
    icon: "/gerb.svg",
    apple: "/gerb.svg",
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://nam-school84.uz"),
  alternates: {
    canonical: "https://nam-school84.uz",
    languages: {
      "uz-UZ": "https://nam-school84.uz/uz",
      "ru-RU": "https://nam-school84.uz/ru",
      "en-US": "https://nam-school84.uz/en",
    },
  },
};

// ❗️ params endi Promise emas — oddiy object
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
