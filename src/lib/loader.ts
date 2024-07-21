import { Message } from "discord.js";
import { IMessageEvent } from "@/lib/interfaces/IMessageEvent";
import "reflect-metadata";
import { BotModuleSymbol } from "@/lib/symbols";
import { HandleEventFunction, ModuleConstructor } from "@/lib/@types/bot";
import resolveEvent from "@/lib/event-resolver";

export function loadEvent(
    botModule: new (...args: any[]) => IMessageEvent,
): HandleEventFunction {
    const eventHandlerClass: ModuleConstructor[] = Reflect.getMetadata(
        BotModuleSymbol,
        botModule,
    );

    const eventResolved = eventHandlerClass.map((event) => resolveEvent(event));
    return async (message) => {
        for (const resolve of eventResolved) {
            await resolve(message);
        }
    };
}
