import { EventModuleT } from "@/lib/@types/bot";
import { BotModuleSymbol, EventModuleEvent } from "@/lib/symbols";

const EventModule = (deps: EventModuleT): ClassDecorator => {
    return (target) => {
        Reflect.defineMetadata(EventModuleEvent, deps, target);
        if (deps.Event === "MessageCreate") {
            Reflect.defineMetadata(BotModuleSymbol, deps.Handler, target);
        }
    };
};

export default EventModule;
