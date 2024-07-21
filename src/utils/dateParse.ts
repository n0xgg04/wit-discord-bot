export default function dateParse(data: Date | string): Date {
    if (typeof data === "string") {
        return new Date(data);
    }
    return data;
}
