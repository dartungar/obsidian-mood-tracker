import { moment } from "src/services/obsidianMoment";

export class DateService {

    static createDateString(date: Date): string {
        return moment(date).format("YYYY-MM-DD");
    }

    static createDateTimeString(date: Date): string {
        return moment(date).format("YYYY-MM-DDTHH:mm");
    }
}
