# Fix: Country-Gate Bug in Best Pages

## Problem
`app/[country]/best/[slug]/client.tsx` line 61 checks `if (code === "de")` — only Germany fetches from Supabase. All other countries get empty products.

The `components/BestReviewClient.tsx` component already handles all countries with image support but is UNUSED.

## EXACT FIX

### Step 1: Replace `app/[country]/best/[slug]/client.tsx`
Replace the ENTIRE file with this simple wrapper:

```tsx
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
```

### Step 2: Verify the import chain
`app/[country]/best/[slug]/page.tsx` already imports from `'./client'` and renders `<BestReviewPageClient params={params} />` — this should work without changes since the export name matches.

### Step 3: Build
Run `npm run build` to verify.
