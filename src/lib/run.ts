import { IBot } from "@/lib/interfaces/IBot";
import ABotRunner from "@/lib/abstracts/ABotRunner";
import { DiscordClient } from "@/lib/client";
import { Events, GatewayIntentBits, REST, Routes } from "discord.js";
import { env } from "@/env";
import { Logger } from "@/lib/logger";
import { loadSlashCommands } from "@/loaders/slashCommands";
import { BotModuleLoader, EventModuleEvent } from "@/lib/symbols";
import { DiscordBotModule, EventModuleT } from "@/lib/@types/bot";
import { loadEvent } from "@/lib/loader";

export default function run(bot: new (...args: any[]) => ABotRunner & IBot) {
    const deps: DiscordBotModule = Reflect.getMetadata(BotModuleLoader, bot);
    const client = DiscordClient.getInstance({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildModeration,
        ],
    });
    const Bot = new bot();
    Bot.onMount();

    const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);
    (async () => {
        try {
            Logger.debug("Started refreshing application (/) commands.");

            const { slashCommands, slashConfigs } = await loadSlashCommands();

            const res: any = await rest.put(
                Routes.applicationCommands(env.DISCORD_APP_ID!),
                {
                    body: slashCommands,
                },
            );

            client.slashConfigs = slashConfigs;

            Logger.debug(`Successfully reloaded ${res.length} (/) commands.`);
            client.login(env.DISCORD_TOKEN);
        } catch (error) {
            Logger.error(
                `Error refreshing application (/) commands: \n\t${error}`,
            );
        }
    })();

    deps.EventModule.forEach((ModuleClass) => {
        const EventData: EventModuleT = Reflect.getMetadata(
            EventModuleEvent,
            ModuleClass,
        );

        switch (EventData.Event) {
            case "MessageCreate":
                client.on(Events.MessageCreate, loadEvent(ModuleClass));
                break;

            default:
                client.on(
                    Events[EventData.Event as keyof typeof Events] as any,
                    EventData.Handler as any,
                );
        }
    });
}
