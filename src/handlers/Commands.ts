import { Joke } from "../Commands/Joke";
import { Roll } from "../Commands/Roll";
import { StevesLatest } from "../Commands/StevesLatest";
import { Help } from "../Commands/Help";
import { Command } from "Types/CommandInteraction";

export const Commands: Command[] = [Joke, Roll, StevesLatest, Help];
