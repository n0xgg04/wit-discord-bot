import { DiscordBotModule } from "@/lib/@types/bot";
import "reflect-metadata";
import { BotModuleLoader } from "@/lib/symbols";

const DiscordBot = (loader: DiscordBotModule): ClassDecorator => {
    return (target) => {
        Reflect.defineMetadata(BotModuleLoader, loader, target);
    };
};

export default DiscordBot;
