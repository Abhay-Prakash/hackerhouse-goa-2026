import { Metadata } from 'next';
import { getCard } from '@/lib/storage';
import CardSharePage from './CardSharePage';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const card = await getCard(id);

  if (!card) {
    return { title: 'Builder Card Not Found — HackerHouse Goa 2026' };
  }

  const title = `${card.name} — ${card.builderClass ?? 'Builder'} · HackerHouse Goa 2026`;
  const description = `${card.builderClassEmoji ?? '⚡'} ${card.builderClass} · ${card.primaryRole} · HackerHouse Goa 2026 · #FrameInGoa`;
  const ogImage = `/api/og?id=${id}`;

  return {
    title,
    description,
    openGraph: {
      title, description,
      type: 'website', siteName: 'HackerHouse Goa 2026',
      images: [{ url: ogImage, width: 1080, height: 1080, alt: title }],
    },
    twitter: {
      card: 'summary_large_image', title, description, images: [ogImage],
    },
  };
}

export default async function CardPage({ params }: Props) {
  const { id } = await params;
  const card = await getCard(id);
  return <CardSharePage card={card ?? null} cardId={id} />;
}
