import { defaultEmotions } from "src/data/defaultEmotions";


export interface MoodTrackerSettings {
    folderPath: string;
    emotions: string[];
    moodRatingLabelDict: { [key: number]: string };
}

export const DEFAULT_SETTINGS: MoodTrackerSettings = {
    folderPath: "./data/",
    emotions: defaultEmotions,
    moodRatingLabelDict: { 
        1: "😨",
        2: "☹️",
        3: "😐",
        4: "🙂",
        5: "😊",
    }
}