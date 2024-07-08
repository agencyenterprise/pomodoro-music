import axios from 'axios';

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

interface Profile {
  display_name: string;
  id: string;
  email: string;
  uri: string;
  external_urls: { spotify: string };
  href: string;
  images: { url: string }[];
}

export async function loginSpotify() {
  const code = localStorage.getItem('code');
  if (!code) {
    redirectToAuthCodeFlow(clientId!);
  }
}

export async function redirectToAuthCodeFlow(clientId: string) {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem('verifier', verifier);

  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('response_type', 'code');
  params.append('redirect_uri', window.location.href);
  params.append('scope', 'user-read-private user-read-email');
  params.append('code_challenge_method', 'S256');
  params.append('code_challenge', challenge);

  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length: number) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function getAccessToken(
  clientId: string,
  code: string,
): Promise<{ access_token: string }> {
  const verifier = localStorage.getItem('verifier');

  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', window.location.href);
  params.append('code_verifier', verifier!);

  const result = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  return result.json();
}

function cleanUpSpotifyStorage() {
  localStorage.removeItem('code');
  localStorage.removeItem('verifier');
  localStorage.removeItem('accessToken');
}

export async function fetchProfile(): Promise<Profile | undefined> {
  const accessToken = localStorage.getItem('accessToken');
  try {
    const result = await axios('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return result.data;
  } catch (error) {
    cleanUpSpotifyStorage();
  }
}

export async function fetchPlaylists(userId: string) {
  const accessToken = localStorage.getItem('accessToken');
  const result = await axios(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return result.data;
}
