import { MessageFilter } from "@/lib/symbols";
import { FilterFunction } from "@/lib/@types/bot";

export default function MessageListener(
    filterFn: Array<FilterFunction>,
): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(MessageFilter, filterFn, target);
    };
}
