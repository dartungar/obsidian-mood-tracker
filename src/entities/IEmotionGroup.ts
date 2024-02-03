import { randomUUID } from "crypto";

export interface IEmotionGroup {
    id: string,
    name: string,
    sortOrder: number | undefined,
    color: string,
    textColor: string | undefined,
    emotions: string[]
}

export class EmotionGroup implements IEmotionGroup {
    id = randomUUID();
    name = "emotion group";
    sortOrder: number | undefined;
    color = "#b84444";
    textColor: string | undefined;
    emotions: string[] = [];
}