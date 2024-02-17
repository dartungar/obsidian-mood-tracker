import { defaultEmotions as defaultEmotionGroups } from "src/data/defaultEmotions";
import { EmotionGroup } from "src/entities/IEmotionGroup";
import { NoteSelectionMethod } from "src/noteIntegration/noteSelectionMethod";


export class MoodTrackerSettings {
    folderPath = "";
    emotionGroups: EmotionGroup[] = [];
    moodRatingLabelDict: { [key: number]: string };
    template: string;
    trackerModalTitle: string;
    useEmotions: boolean;
    noteIntegrationSettings: NoteIntegrationSettings;
}

export interface NoteIntegrationSettings {
    isEnabled: boolean;
    dateTemplate?: string;
    noteSelectionMethod?: NoteSelectionMethod;
    folderPath?: string;
}

export const DEFAULT_SETTINGS: MoodTrackerSettings = {
    folderPath: "./data/",
    emotionGroups: defaultEmotionGroups,
    moodRatingLabelDict: { 
        1: "😨",
        2: "☹️",
        3: "😐",
        4: "🙂",
        5: "😊",
    },
    template: "- {{ICON}} {{NOTE}}",
    trackerModalTitle: "How are you feeling?",
    useEmotions: true,
    noteIntegrationSettings: {
        isEnabled: false
    }
}