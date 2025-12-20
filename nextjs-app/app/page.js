'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  
  // Redirect to donate page (main page)
  router.push('/donate');
  
  return null;
}
