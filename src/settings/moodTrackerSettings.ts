import { defaultEmotions as defaultEmotionGroups } from "src/data/defaultEmotions";
import { EmotionGroup } from "src/entities/IEmotionGroup";
import type { SupportedLanguage } from "src/i18n";


export class MoodTrackerSettings {
    folderPath = "";
    emotionGroups: EmotionGroup[] = [];
    moodRatingLabelDict: { [key: number]: string };
    moodRatingLabelSize: number;
    trackerModalTitle: string;
    useEmotions: boolean;
	sortEmotionsAlphabetically: boolean;
    addToJournal: boolean;
    journalPosition: string;
    journalFilePath: string;
    entryTemplate: string;
    chartColor: string;
    language?: SupportedLanguage; // User-selected language (optional)
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
    moodRatingLabelSize: 3,
    entryTemplate: "- {{ICON}} {{NOTE}}",
    trackerModalTitle: "How are you feeling?",
    useEmotions: true,
	sortEmotionsAlphabetically: false,
    journalPosition: "## Mood Tracker",
    addToJournal: false,
    journalFilePath: "",
    chartColor: "#b26aba",
    language: undefined // Auto-detect from Obsidian
}