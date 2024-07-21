import { IBot } from "@/lib/interfaces/IBot";

export default abstract class ABotRunner implements IBot {
    run() {
        this.onMount();
    }

    onMount() {}
}
