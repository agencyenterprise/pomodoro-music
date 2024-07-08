declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    // eslint-disable-next-line
    onSpotifyIframeApiReady: (IFrameAPI: any) => void;
    // eslint-disable-next-line
    Spotify: any;
  }
}
