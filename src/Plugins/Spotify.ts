import SpotifyWebApi from "spotify-web-api-node";
let Spotify: SpotifyWebApi | null = null;
export default async () => {
  if (!Spotify) {
    Spotify = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    const authentication = await Spotify.clientCredentialsGrant();
    process.env.SPOTIFY_ACCESS_TOKEN = authentication.body.access_token;
    Spotify.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);
  }
  return Spotify;
};
