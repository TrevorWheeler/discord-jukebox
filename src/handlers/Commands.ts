import { Joke } from "../Commands/Joke";
import { Roll } from "../Commands/Roll";
import { StevesLatest } from "../Commands/StevesLatest";
import { Help } from "../Commands/Help";
import { CommandInteraction } from "../Types/CommandInteraction";

export const Commands: CommandInteraction[] = [Joke, Roll, StevesLatest, Help];
