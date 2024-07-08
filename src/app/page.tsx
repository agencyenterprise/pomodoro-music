'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { fetchProfile, getAccessToken, loginSpotify } from '@/services/spotify';

import { Player } from './components/Player';

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string>('');
  const { mutate: spotifyLoginMutation } = useMutation({
    mutationFn: loginSpotify,
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    enabled: !!accessToken,
  });

  useEffect(() => {
    const code = searchParams.get('code') || localStorage.getItem('code');
    const accessTokenLocal = localStorage.getItem('accessToken');
    if (code && !accessTokenLocal) {
      localStorage.setItem('code', code!);
      router.replace('/');
      getAccessToken(clientId!, code as string).then((accessToken) => {
        if (accessToken.access_token) {
          localStorage.setItem('accessToken', accessToken.access_token);
          setAccessToken(accessToken.access_token);
        }
      });
    } else {
      setAccessToken(accessTokenLocal || '');
    }
  }, []);

  return (
    <main className="flex flex-col gap-10 p-24">
      <button onClick={() => spotifyLoginMutation()}>Login with spotify</button>
      <h1>Display your Spotify profile data</h1>
      {profile && <Player profileId={profile.id} />}
    </main>
  );
}
