import SpotifyWebApi from "spotify-web-api-node";
let Spotify: SpotifyWebApi | null = null;
export default async () => {
  if (!Spotify) {
    Spotify = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    const authentication = await Spotify.clientCredentialsGrant();
    Spotify.setAccessToken(authentication.body.access_token);
  }
  return Spotify;
};



