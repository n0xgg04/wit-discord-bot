import "reflect-metadata";
import { MessageDataRoute } from "@/lib/symbols";

const MessageData = (key?: string[]): ParameterDecorator => {
    return (target, propertyKey, parameterIndex) => {
        Reflect.defineMetadata(MessageDataRoute, key, target);
    };
};

export default MessageData;
