import moment from "moment-timezone";

moment.tz("Asia/Ho_Chi_Minh");
export default function dateParse(data: Date | string): Date {
    if (typeof data === "string") {
        return moment(data).toDate();
    }
    return data;
}
