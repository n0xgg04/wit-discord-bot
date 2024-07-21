import type { DiscordClient } from "@/lib/client";
import { Logger } from "@/lib/logger";
import EventModule from "@/lib/decorators/EventModule";

@EventModule({
    Event: "ClientReady",
    Handler: (client: DiscordClient) => {
        Logger.info(`Logged in as ${client.user?.tag}!`);
    },
})
class ClientReady {}

export default ClientReady;
