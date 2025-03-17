import { EmotionGroup } from "src/entities/IEmotionGroup";
import MoodTrackerPlugin from "src/main";

export class EmotionsService {


    constructor(private _plugin: MoodTrackerPlugin) {
        
    }

    public async saveEmotionsGroup(emotionGroup: EmotionGroup): Promise<void> {
        this._plugin.settings.emotionGroups.forEach(x => {
            if (x.id === emotionGroup.id) {
                x = emotionGroup;
            }
        })

        await this._plugin.saveSettings();
    }

    public async deleteEmotionsGroup(emotionGroup: EmotionGroup): Promise<void> {
        this._plugin.settings.emotionGroups.remove(emotionGroup);
        await this._plugin.saveSettings();
    }

    public sortEmotionGroups(emotionGroups: EmotionGroup[]): EmotionGroup[] {
		// Find the highest sortOrder that is defined
		const maxSortOrder = emotionGroups.reduce((max, group) => {
			if (group.sortOrder !== undefined && group.sortOrder > max) {
				return group.sortOrder;
			}
			return max;
		}, 0);

		// Fill undefined sortOrder values with incrementing numbers starting from maxSortOrder + 1
		let nextSortOrder = maxSortOrder + 1;
		const filledGroups = emotionGroups.map((emotionGroup) => ({
			...emotionGroup,
			sortOrder:
				emotionGroup.sortOrder !== undefined
					? emotionGroup.sortOrder
					: nextSortOrder++,
				emotions: this._plugin.settings.sortEmotionsAlphabetically && emotionGroup.emotions
					? [...emotionGroup.emotions].sort((a, b) => a.localeCompare(b)) // Sort emotions alphabetically
					: emotionGroup.emotions,
		}));
		

		// Now, sort the notes array by sortOrder
		filledGroups.sort((a, b) => a.sortOrder - b.sortOrder);

		return filledGroups as unknown as EmotionGroup[];
	}


}