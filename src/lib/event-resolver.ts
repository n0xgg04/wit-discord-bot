import {
    DiscordMessageHandler,
    FilterFunction,
    ModuleConstructor,
} from "@/lib/@types/bot";
import { Message } from "discord.js";
import { MessageDataRoute, MessageFilter } from "@/lib/symbols";
import useDiscordClient from "@/lib/hooks/useDiscordClient";
import r from "ramda";

export default function resolveEvent(
    eventClass: ModuleConstructor,
): DiscordMessageHandler {
    const filter: FilterFunction[] = Reflect.getMetadata(
        MessageFilter,
        eventClass,
    );
    return async (message: Message) => {
        if (message.author.bot) return;

        const checkValid = filter.map((fn) => fn(message.content));
        if (checkValid.includes(false)) return;

        const instant = new eventClass();
        const client = useDiscordClient();

        const keyRoute: string[] = Reflect.getMetadata(
            MessageDataRoute,
            eventClass,
        );

        await instant.handler(
            keyRoute ? r.path(keyRoute, message) : message,
            client,
        );
    };
}
