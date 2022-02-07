const puppeteer = require("puppeteer");
import SpotifyWebApi from "spotify-web-api-node";

const scopes = [
  "ugc-image-upload",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "streaming",
  "app-remote-control",
  "user-read-email",
  "user-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-read-private",
  "playlist-modify-private",
  "user-library-modify",
  "user-library-read",
  "user-top-read",
  "user-read-playback-position",
  "user-read-recently-played",
  "user-follow-read",
  "user-follow-modify",
];
export default async function spotify() {
  // const Spotify = new SpotifyWebApi({
  //   clientId: process.env.SPOTIFY_CLIENT_ID,
  //   clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  //   redirectUri: process.env.SERVER + ":" + process.env.PORT + "/callback",
  // });

  // const authenticationResponse = await Spotify.clientCredentialsGrant();
  // Spotify.setAccessToken(authenticationResponse.body.access_token);

  // // console.log(Spotify.getCredentials());
  // const authorizeURL = Spotify.createAuthorizeURL(scopes, "state", showDialog);
  // console.log(authorizeURL);

  // const Spotify = new SpotifyWebApi({
  //   clientId: process.env.SPOTIFY_CLIENT_ID,
  //   clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  //   accessToken:
  //     "BQDjDzh6gDL9WxeuQnVQ78wvJ7zk1j8c8x-zjdw4MeuRkbiCcmE4iRtudxkN7cuSqfar4oE3o3Cb56qhPSQSxn8gG7ybE9A4DhyA-uoDgh0yABjzgN_HeqtTc4p_qTWcRurDXlFIlFyld-lRKvyctQICzP3jNW9xTHEigFmpxgmwDXg1sU-_9a2K5Neu9tj_WJBZL5q0-aqV8NGv_UQihLvzrdL2o1MWytZaxMAM19TkiDvQRmx4jhxFPEr3r6VvDhMQ348PAmulKHycNG6QM2XM3bor",
  //   refreshToken:
  //     "AQD81cFM_1FBHnGDxFdRE9IKYYCQU5CokW2H-bKb9WKPoKG38WdeGcImHeMh7N7LvMRyIPFqbZI8E_WwOClOJRtBRZPyaAnKotXGQgxSBZcIzJ1VAXMQzfJoAKS5Fagm7kE",
  // });

  // const bangersAndClangers = await Spotify.getPlaylist(
  //   "6Lbd3XVZtsatcq3vuK9PkV"
  // );
  // console.log(bangersAndClangers);

  // // Spotify.pause();
  // // Get a User's Available Devices
  // // const divices = await Spotify.getMyDevices();

  // // const deviceId = divice;

  // Spotify.play();

  return;
}
const showDialog: boolean = false;

// export default async function spotify() {
//   const Spotify = new SpotifyWebApi({
//     clientId: process.env.SPOTIFY_CLIENT_ID,
//     clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
//     redirectUri: process.env.SERVER + ":" + process.env.PORT + "/callback",
//   });
//   const authenticationResponse = await Spotify.clientCredentialsGrant();
//   Spotify.setAccessToken(authenticationResponse.body.access_token);
//   console.log(Spotify.getCredentials());
//   const authorizeURL = Spotify.createAuthorizeURL(scopes, "state", showDialog);

//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   await page
//     .goto(authorizeURL, {
//       waitUntil: "networkidle0",
//     })
//     .then(() => console.log("page is open"));
//   await page.type("#login-username", process.env.EMAIL);
//   await page.type("#login-password", process.env.PASSWORD);

//   await page.click("#login-button");
//   page.waitForNavigation({ waitUntil: "networkidle2" });
//   browser.close();
//   return;
// }

// import SpotifyWebApi from "spotify-web-api-node";
// const express = require("express");
// const app = express();

// const Spotify = new SpotifyWebApi({
//   clientId: process.env.SPOTIFY_CLIENT_ID,
//   clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
//   redirectUri: process.env.SERVER + ":" + process.env.PORT + "/callback",
// });

// app.get("/callback", async (req: any, res: any) => {
//   try {
//     const authenticated = await Spotify.authorizationCodeGrant(req.query.code);
//     Spotify.setAccessToken(authenticated.body["access_token"]);
//     Spotify.setRefreshToken(authenticated.body["refresh_token"]);
//     console.log(Spotify.getCredentials());
//     // const bangersAndClangers = await Spotify.getPlaylist(
//     //   "6Lbd3XVZtsatcq3vuK9PkV"
//     // );
//     // console.log(bangersAndClangers);
//     // setInterval(async () => {
//     //   const data = await Spotify.refreshAccessToken();
//     //   const access_token = data.body["access_token"];

//     //   console.log("The access token has been refreshed!");
//     //   console.log("access_token:", access_token);
//     //   Spotify.setAccessToken(access_token);
//     // }, (authenticated.body["expires_in"] / 2) * 1000);
//   } catch (error: any) {
//     console.error(error);
//   }
// });

// app.listen(process.env.PORT, () => {
//   console.log(
//     `Example app listening on port ${process.env.SERVER}:${process.env.PORT}/login`
//   );
// });
