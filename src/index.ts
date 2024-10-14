require("dotenv").config();
import { Client, GatewayIntentBits } from "discord.js";
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import messageCreate from "./listeners/messageCreate";
import Spotify from "./Plugins/Spotify";
import JukeBox from "./Plugins/JukeBox";
const client: Client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    // GatewayIntentBits.GuildMembers,
  ],
});

client.on("voiceStateUpdate", (oldState, newState) => {
  if (!oldState || !oldState.channel || !oldState.channel.members) {
    return;
  }
  if (oldState.channel.members.size === 1) {
    JukeBox.destroyChannel();
  }
});
ready(client);
interactionCreate(client);
messageCreate(client);

client.login(
  process.env.NODE_ENV !== "development"
    ? process.env.FILTHY_BOT_TOKEN
    : process.env.FILTHY_BOT_TOKEN_DEV
);
Spotify();
