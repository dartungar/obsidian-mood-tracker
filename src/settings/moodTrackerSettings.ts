import { defaultEmotions as defaultEmotionGroups } from "src/data/defaultEmotions";
import { EmotionGroup } from "src/entities/IEmotionGroup";


export class MoodTrackerSettings {
    folderPath = "";
    emotionGroups: EmotionGroup[] = [];
    moodRatingLabelDict: { [key: number]: string };
    moodRatingLabelSize: number;
    trackerModalTitle: string;
    useEmotions: boolean;
	sortEmotionsAlphabetically: boolean;
	collapseEmotionGroupsByDefault: boolean;
    addToJournal: boolean;
    journalPosition: string;
    journalFilePath: string;
    entryTemplate: string;
    chartColor: string;
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
	collapseEmotionGroupsByDefault: false,
    journalPosition: "## Mood Tracker",
    addToJournal: false,
    journalFilePath: "",
    chartColor: "#b26aba"
}
