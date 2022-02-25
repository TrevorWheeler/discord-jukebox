require("dotenv").config();
import { Client, Intents } from "discord.js";
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import messageCreate from "./listeners/messageCreate";
var Queue = require("./db/schema/PlayQueue");
import Spotify from "./Plugins/Spotify";
import Player from "./Plugins/player";
import playerListener from "./listeners/playerListener";
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});



const player = Player();

ready(client);
interactionCreate(client);
messageCreate(client);
playerListener(player);
client.login(process.env.FILTHY_BOT_TOKEN);

Spotify();
