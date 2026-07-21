'use client';

import { use } from 'react';
import BestReviewClient from '@/components/BestReviewClient';

export default function BestReviewPageClient({
  params,
}: {
  params: Promise<{ country: string; slug: string }>;
}) {
  const { country, slug } = use(params);
  return <BestReviewClient code={country} slug={slug} />;
}
