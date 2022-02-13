const puppeteer = require("puppeteer");
import SpotifyWebApi from "spotify-web-api-node";

// if puppeteer is true it will automate the proccess of authentication. Spotify credentials required in .env
const usePuppeteer: boolean = true;
const showDialog: boolean = false;
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

export default async function authenticateSpotify() {
  const Spotify = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SERVER + ":" + process.env.PORT + "/callback",
  });
  const authenticationResponse = await Spotify.clientCredentialsGrant();
  Spotify.setAccessToken(authenticationResponse.body.access_token);
  process.env.SPOTIFY_ACCESS_TOKEN = authenticationResponse.body.access_token;
  const authorizeURL = Spotify.createAuthorizeURL(scopes, "state", showDialog);
  console.log(
    "Open link to enter spotify credentials and recieve callback: " +
      authorizeURL
  );
  if (!usePuppeteer) {
    return;
  }

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(authorizeURL, {
    waitUntil: "networkidle0",
  });
  await page.type("#login-username", process.env.SPOTIFY_USERNAME);
  await page.type("#login-password", process.env.SPOTIFY_PASSWORD);
  await page.click("#login-button");
  // await page.waitForNavigation();
  // await page.setDefaultNavigationTimeout(2000);
  await page.waitForTimeout(4000);

  browser.close();
  return Spotify;
}
