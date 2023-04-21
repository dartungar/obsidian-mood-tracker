import { defaultMoods } from "src/data/defaultMoods";


export interface MoodTrackerSettings {
    filePath: string;
    moods: string[];
}

export const DEFAULT_SETTINGS: MoodTrackerSettings = {
    filePath: "data/mood-tracker-settings.json",
    moods: defaultMoods
}