import { defaultMoods } from "src/data/defaultMoods";


export interface MoodTrackerSettings {
    folderPath: string;
    moods: string[];
}

export const DEFAULT_SETTINGS: MoodTrackerSettings = {
    folderPath: "./data/",
    moods: defaultMoods
}