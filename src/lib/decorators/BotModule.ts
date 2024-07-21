import { BotModuleSymbol } from "@/lib/symbols";
import { ModuleConstructor } from "@/lib/@types/bot";

const BotModule = (events: ModuleConstructor[]): ClassDecorator => {
    return (target) => {
        Reflect.defineMetadata(BotModuleSymbol, events, target);
    };
};

export default BotModule;
