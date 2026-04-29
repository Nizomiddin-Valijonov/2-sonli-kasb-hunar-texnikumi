// app/[lng]/news/[id]/page.tsx

import NewsDetailClient from "./NewsDetailClient";

export async function generateStaticParams() {
  const languages = ["uz", "ru", "en"];
  const newsIds = ["1", "2", "3"]; // real id’larni API’dan keyin avtomat qilamiz

  const params: { lng: string; id: string }[] = [];
  for (const lng of languages) {
    for (const id of newsIds) {
      params.push({ lng, id });
    }
  }
  return params;
}

export default function NewsDetailPage({
  params,
}: {
  params: { lng: string; id: string };
}) {
  return <NewsDetailClient id={params.id} lng={params.lng} />;
}
