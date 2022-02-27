import { InternalDiscordGatewayAdapterCreator } from 'discord.js';

export default interface ChannelConfig {
    guildId: string,
    channelId: string,
    adapterCreator: InternalDiscordGatewayAdapterCreator;
}