/* eslint-disable camelcase */
'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
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

export function Player({ profileId, playMusic }: { profileId: string; playMusic?: boolean }) {
  const { data: playlists } = useQuery({
    queryKey: ['playlists'],
    queryFn: () => fetchPlaylists(profileId),
  });
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>();

  useEffect(() => {
    if (playlists?.items.length) {
      const interval = setInterval(() => {
        if (EmbedController) {
          EmbedController?.loadUri(`spotify:playlist:${playlists.items[0].id}`);
          setSelectedPlaylist(playlists.items[0].id);
          clearInterval(interval);
        }
      }, 100);
    }
  }, [playlists]);

  useEffect(() => {
    if (playMusic !== undefined && selectedPlaylist) {
      if (playMusic) {
        EmbedController?.resume();
      } else {
        EmbedController?.pause();
      }
    }
  }, [playMusic, selectedPlaylist]);

  return (
    <>
      {playlists && (
        <section className="container mx-auto">
          <h2 className="text-3xl font-bold">Playlists</h2>
          <div className="max-h-[300px] overflow-scroll">
            <ul className="space-y-3 p-10">
              {playlists.items.length === 0 && <li>No playlists found</li>}
              {playlists.items.map((playlist) => (
                <li key={playlist.id} className="">
                  <button
                    onClick={() => {
                      setSelectedPlaylist(playlist.id);
                      EmbedController?.loadUri(`spotify:playlist:${playlist.id}`);
                    }}
                    className="flex gap-3"
                  >
                    <Image src={playlist.images[0].url} width={50} height={50} alt="Album cover" />
                    {playlist.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <Script src="https://open.spotify.com/embed/iframe-api/v1" async />
    </>
  );
}
