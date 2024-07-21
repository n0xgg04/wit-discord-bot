import DiscordBot from "@/lib/decorators/DiscordBot";
import { IBot } from "@/lib/interfaces/IBot";
import ABotRunner from "@/lib/abstracts/ABotRunner";
import MessageCreate from "@/events/MessageCreate";
import run from "@/lib/run";
import ClientReady from "@/events/ClientReady";
import { Logger } from "@/lib/logger";

@DiscordBot({
    SplashCommand: 0,
    EventModule: [MessageCreate, ClientReady],
})
class MyBot extends ABotRunner implements IBot {
    override onMount() {
        Logger.info("Connecting to Discord...");
    }
}

run(MyBot);
