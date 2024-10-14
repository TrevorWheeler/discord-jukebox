import { Bangers } from "../Messages/Bangers";
import { Stop } from "../Messages/Stop";
import { Skip } from "../Messages/Skip";
import { Play } from "../Messages/Play";
import { ListQueue } from "../Messages/ListQueue";
import { Show } from "../Messages/Show";
import { MessageInteraction } from "../Types/MessageInteraction";
import { AIChat } from "../Messages/AIChat";
export const Messages: MessageInteraction[] = [
  Stop,
  Bangers,
  Skip,
  Play,
  Show,
  ListQueue,
  AIChat,
];
