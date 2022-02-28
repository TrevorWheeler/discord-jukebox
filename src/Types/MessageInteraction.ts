import {
    Client,
    Message,
    MessageApplicationCommandData,
} from "discord.js";

export interface MessageInteraction extends MessageApplicationCommandData {
    description: string,
    run: (client: Client, interaction: Message) => void;
}