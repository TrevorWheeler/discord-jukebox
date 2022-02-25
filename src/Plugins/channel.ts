import {
    AudioPlayer,
    CreateAudioPlayerOptions,
    VoiceConnection,
} from "@discordjs/voice";
import { VoiceBasedChannel, VoiceChannel } from "discord.js";

const {
    entersState,
    VoiceConnectionStatus,
    joinVoiceChannel,
} = require("@discordjs/voice");

let instance: VoiceConnection | null = null;

export default async (channel: VoiceBasedChannel | null, destroy: boolean = false) => {
    try {
        if (!channel && destroy) {
            if (!instance) {
                return;
            }
            instance.destroy();
            instance = null;
        }
        if (!instance && channel) {
            instance = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });
            if (!instance) {
                return null;
            }
            instance.on(VoiceConnectionStatus.Ready, () => {
                console.log('Join request recieved. Ready to join.');
            });
            instance.on(VoiceConnectionStatus.Disconnected, async (prev: any, next: any) => {
                await Promise.race([
                    entersState(instance, VoiceConnectionStatus.Signalling, 5_000),
                    entersState(instance, VoiceConnectionStatus.Connecting, 5_000),
                ]);
            });
            await entersState(instance, VoiceConnectionStatus.Ready, 30_000);
        }




    } catch (error: any) {
        if (instance) {
            instance.destroy();
            instance = null;
        }
    } finally {
        return instance;
    }

};
