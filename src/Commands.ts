import { Joke } from "./Commands/Joke";
import { Ranks } from "./Commands/Ranks";
import { Roll } from "./Commands/Roll";
import { StevesLatest } from "./Commands/StevesLatest";
import { BangersAndClangers } from "./Commands/BangersAndClangers";
import { Help } from "./Commands/Help";
import { Command } from "./Types/Command";

export const Commands: Command[] = [
  Joke,
  Ranks,
  Roll,
  StevesLatest,
  BangersAndClangers,
  Help,
];
