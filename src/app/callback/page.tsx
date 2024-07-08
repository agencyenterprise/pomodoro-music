'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { getAccessToken } from '@/services/spotify';

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

export default function Callback() {
  const hasRun = useRef(false);
  const route = useRouter();
  const searchParams = useSearchParams();

  const code = searchParams.get('code');

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;

      if (!code) {
        route.push('/');
      }

      localStorage.setItem('code', code!);
      getAccessToken(clientId!, code as string).then((accessToken) => {
        if (accessToken.access_token) {
          localStorage.setItem('accessToken', accessToken.access_token);
        }
      });

      route.push('/');
    }
  }, []);

  return null;
}
