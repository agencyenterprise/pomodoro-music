/* eslint-disable camelcase */
'use client';

import { useQuery } from '@tanstack/react-query';
import Script from 'next/script';
import { useEffect, useState } from 'react';

import { fetchPlaylists } from '@/services/spotify';

let EmbedController;
globalThis.onSpotifyIframeApiReady = (IFrameAPI) => {
  const callback = (EmbedControl) => {
    EmbedController = EmbedControl;
  };

  const element = document.getElementById('embed-spotify');
  IFrameAPI.createController(element, {}, callback);
};

export function Player({ profileId }: { profileId: string }) {
  const { data: playlists } = useQuery({
    queryKey: ['playlists'],
    queryFn: () => fetchPlaylists(profileId),
  });
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>();

  useEffect(() => {
    if (playlists?.items.length) {
      const interval = setInterval(() => {
        console.log('EmbedController');
        if (EmbedController) {
          console.log('load');
          EmbedController?.loadUri(`spotify:playlist:${playlists.items[0].id}`);
          setSelectedPlaylist(playlists.items[0].id);
          clearInterval(interval);
        }
      }, 100);
    }
  }, [playlists]);

  return (
    <>
      {playlists && (
        <section id="playlists">
          <h2>Playlists</h2>
          <button
            onClick={() => {
              if (selectedPlaylist) {
                EmbedController.play();
              }
            }}
          >
            Play/Pause
          </button>
          <ul className="pl-10">
            {playlists.items.length === 0 && <li>No playlists found</li>}
            {playlists.items.map((playlist: any) => (
              <li key={playlist.id} className="list-disc">
                <button
                  onClick={() => {
                    setSelectedPlaylist(playlist.id);
                    EmbedController?.loadUri(`spotify:playlist:${playlist.id}`);
                  }}
                >
                  {playlist.name}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
      <Script src="https://open.spotify.com/embed/iframe-api/v1" async />
    </>
  );
}
