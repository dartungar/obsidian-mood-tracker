// eslint-disable-next-line @typescript-eslint/no-unused-vars
import moment from "moment";

export class DateService {

    static createDateString(date: Date): string {
        return window
		.moment(date)
		.format("YYYY-MM-DD");
    }

    static createDateTimeString(date: Date): string {
        return window
		.moment(date)
		.format("YYYY-MM-DDTHH:mm");
    }
}