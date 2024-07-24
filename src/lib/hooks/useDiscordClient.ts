import { DiscordClient } from "../client";

function useDiscordClient(): DiscordClient {
    return DiscordClient.getInstance();
}

export default useDiscordClient;
