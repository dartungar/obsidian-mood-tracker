export interface IMoodTrackerEntry {
    id: string;
    dateTime: Date;
    moodRating: number;
    emotions: string[];
    note: string;
}

export class MoodTrackerEntry implements IMoodTrackerEntry {
    id: string;
    dateTime: Date;
    moodRating: number;
    emotions: string[];
    note: string;

    constructor(moodRating = 3, emotions: string[] = [], note = "", dateTime: Date = new Date()) {
        this.id = crypto.randomUUID();
        this.dateTime = dateTime;
        this.moodRating = Number(moodRating);
        this.emotions = emotions;
        this.note = note;
    }
}