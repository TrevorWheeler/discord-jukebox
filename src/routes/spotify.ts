import SpotifyWebApi from "spotify-web-api-node";

var express = require("express");
var router = express.Router();

router.get("/callback", async (req: any, res: any) => {
  try {
    const Spotify = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.SERVER + ":" + process.env.PORT + "/callback",
    });

    const authenticated = await Spotify.authorizationCodeGrant(req.query.code);
    Spotify.setAccessToken(authenticated.body["access_token"]);
    Spotify.setRefreshToken(authenticated.body["refresh_token"]);

    // Spotify is now authenticated and can interact with an active spotify device.
    console.log(Spotify.getCredentials());
    process.env.SPOTIFY_TOKEN = authenticated.body["access_token"];
    process.env.SPOTIFY_REFRESH_TOKEN = authenticated.body["refresh_token"];

    // const bangersAndClangers = await Spotify.getPlaylist(
    //   "6Lbd3XVZtsatcq3vuK9PkV"
    // );
    // console.log(bangersAndClangers);

    // REFRESH TOKEN
    // setInterval(async () => {
    //   const data = await Spotify.refreshAccessToken();
    //   const access_token = data.body["access_token"];
    //   console.log("The access token has been refreshed!");
    //   console.log("access_token:", access_token);
    //   Spotify.setAccessToken(access_token);
    // }, (authenticated.body["expires_in"] / 2) * 1000);
  } catch (error: any) {
    console.error(error);
  }
});
export default router;
