import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "../globals.css";
import Navbar from "../components/Navbar/Navbar";

const rubikSans = Rubik({
  variable: "--font-rubik-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "33-maktab – Rasmiy veb-sayt",
  description:
    "33-maktab – yosh avlod uchun bilim va ma’naviyat maskani. O‘quvchilar uchun yangiliklar, tadbirlar, ta’lim muhitidan xabardor bo‘ling.",
  keywords: [
    "33-maktab",
    "maktab",
    "Uzbekistan school",
    "ta’lim",
    "maktab yangiliklari",
    "o‘quvchilar",
    "uzedu",
  ],
  authors: [{ name: "Nizomiddin Valijanov" }],
  creator: "33-maktab",
  publisher: "33-maktab",
  openGraph: {
    title: "33-maktab – Rasmiy veb-sayt",
    description:
      "Bilim va ma’naviyat maskani. Maktab yangiliklari, tadbirlar va ta’lim jarayoni haqida batafsil ma’lumot.",
    url: "https://33-maktab.uz",
    siteName: "33-maktab",
    images: [
      {
        url: "./gerb.svg", // public papkaga rasmi qo‘yish kerak
        width: 1200,
        height: 630,
        alt: "33-maktab",
      },
    ],
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "33-maktab – Rasmiy veb-sayt",
    description:
      "33-maktab – yosh avlod uchun bilim va ma’naviyat maskani. Yangiliklar va tadbirlar bilan tanishing.",
    images: ["/og-image.jpg"],
    creator: "@33maktab",
  },
  icons: {
    icon: "/gerb.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://33-maktab.uz"),
  alternates: {
    canonical: "https://33-maktab.uz",
    languages: {
      "uz-UZ": "https://33-maktab.uz/uz",
      "ru-RU": "https://33-maktab.uz/ru",
      "en-US": "https://33-maktab.uz/en",
    },
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lng: string }>;
}>) {
  const { lng } = await params;
  return (
    <html lang={lng}>
      <body className={`${rubikSans.variable} antialiased`}>
        <Navbar lng={lng} />
        {children}
      </body>
    </html>
  );
}
