import { IMessageListenerHandler } from "@/lib/interfaces/IMessageListenerHandler";
import { Events, Message } from "discord.js";

type ModuleConstructor = new (...args: any[]) => IMessageListenerHandler;
type HandleEventFunction = (message: Message) => Promise<void>;
type FilterFunction = (message: string) => boolean;
type DiscordMessageHandler = (message: Message) => Promise<void>;
type DiscordBotModule = {
    SplashCommand: any;
    EventModule: Array<new (...args: any[]) => any>;
};
type FilterFnHOK = (content: string) => FilterFunction;

type EventModuleT =
    | {
          Event: "MessageCreate";
          Handler: ModuleConstructor[];
      }
    | {
          Event: Omit<keyof typeof Events, "MessageCreate">;
          Handler: Function;
      };
