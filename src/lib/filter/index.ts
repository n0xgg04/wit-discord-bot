import { FilterFnHOK, FilterFunction } from "@/lib/@types/bot";

const startWith: FilterFnHOK = (content) => {
    return (message) => {
        return message.startsWith(content);
    };
};

const equals: FilterFnHOK = (content) => {
    return (message) => {
        return content == message;
    };
};

const includes: FilterFnHOK = (content) => {
    return (message) => {
        return message.includes(content);
    };
};

function not(fn: FilterFunction) {
    return (message: string) => {
        return !fn(message);
    };
}

export const Filter = {
    startWith,
    includes,
    equals,
    not,
};
