import { Client, Intents } from "discord.js";
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import messageCreate from "./listeners/messageCreate";
require("dotenv").config();
import SpotifyWebApi from "spotify-web-api-node";
const express = require("express");
const app = express();

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

app.get("/callback", async (req: any, res: any) => {
  try {
    const Spotify = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.SERVER + ":" + process.env.PORT + "/callback",
    });

    const authenticated = await Spotify.authorizationCodeGrant(req.query.code);
    Spotify.setAccessToken(authenticated.body["access_token"]);
    Spotify.setRefreshToken(authenticated.body["refresh_token"]);
    console.log(Spotify.getCredentials());
    // const bangersAndClangers = await Spotify.getPlaylist(
    //   "6Lbd3XVZtsatcq3vuK9PkV"
    // );
    // console.log(bangersAndClangers);
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

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
ready(client);
interactionCreate(client);
messageCreate(client);
client.login(process.env.TOKEN);

app.listen(process.env.PORT, () => {
  console.log(
    `Example app listening on port ${process.env.SERVER}:${process.env.PORT}/login`
  );
});
