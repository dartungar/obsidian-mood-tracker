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

    constructor(moodRating: number, emotions: string[], note: string) {
        this.id = crypto.randomUUID();
        this.dateTime = new Date();
        this.moodRating = Number(moodRating);
        this.emotions = emotions;
        this.note = note;
    }
}