import { DiscordClient } from "@/lib/client";

function useDiscordClient() {
    return DiscordClient.getInstance();
}

export default useDiscordClient;
