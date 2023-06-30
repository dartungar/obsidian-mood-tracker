export interface IEmotionSection {
    name: string,
    color: string,
    emotions: string[]
}

export class EmotionSection implements IEmotionSection {
    name = "Emotion (mood) section";
    color = "#b84444";
    emotions: string[] = [];
}