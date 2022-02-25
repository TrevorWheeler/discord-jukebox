import { entersState, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus } from '@discordjs/voice';
import { VoiceBasedChannel } from 'discord.js';

//Import the mongoose module
const mongoose = require("mongoose");

class Channel {
    channel: VoiceConnection | null;
    constructor(channel: VoiceBasedChannel) {
        try {
            this.channel = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });
            this.channel.on(VoiceConnectionStatus.Ready, () => {
                console.log('Channel set up. Ready to join.');
            });
            this.channel.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
                await Promise.race([
                    entersState(this.channel, VoiceConnectionStatus.Signalling, 5_000),
                    entersState(this.channel, VoiceConnectionStatus.Connecting, 5_000),
                ]);
            });


            // this.connection
            //     .on("open", console.info.bind(console, "Database connection: open"))
            //     .on("close", console.info.bind(console, "Database connection: close"))
            //     .on(
            //         "disconnected",
            //         console.info.bind(console, "Database connection: disconnected")
            //     )
            //     .on("error", console.error.bind(console, "MongoDB connection: error:"));
        } catch (error) {
            this.channel.destroy();
            console.error(error);
        }
    }

    // async connect() {
    //     try {
    //         await mongoose.connect(
    //             `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:27017/${process.env.DB_NAME}`
    //         );
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // async close() {
    //     try {
    //         await this.connection.close();
    //     } catch (error) {
    //         console.error(error);
    //     }
}
}

module.exports = new Database();
// if (destroy) {
//     instance = null;
//     return instance;
//   }
//   if (!instance && channel) {
//     instance = joinVoiceChannel({
//       channelId: channel.id,
//       guildId: channel.guild.id,
//       adapterCreator: channel.guild.voiceAdapterCreator,
//     });
//     await entersState(instance, VoiceConnectionStatus.Ready, 30_000);
//   }
//   return instance;