require("dotenv").config();
const express = require("express");
const app = express();
import spotifyRoute from "./routes/spotify";

import { Client, Intents } from "discord.js";
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import messageCreate from "./listeners/messageCreate";

import authenticateSpotify from "./Plugins/authenticateSpotify";

app.use("/", spotifyRoute);
// Needs work.
// authenticateSpotify();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});
ready(client);
interactionCreate(client);
messageCreate(client);
client.login(process.env.FILTHY_BOT_TOKEN);

app.listen(process.env.PORT, () => {
  console.log(
    `Filthy Bot is live - ${process.env.SERVER}:${process.env.PORT}/login`
  );
});
