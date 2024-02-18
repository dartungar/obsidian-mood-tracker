import { App } from "obsidian";
import { MoodTrackerSettingsTab } from "../settingsTab";
import { EmotionGroup } from "src/entities/IEmotionGroup";
import MoodTrackerPlugin from "src/main";
import { ConfirmationModal } from "src/common/confirmationModal";

export class EmotionGroupDeleteModal extends ConfirmationModal {
	constructor(
		app: App,
		private plugin: MoodTrackerPlugin,
		private settingsTab: MoodTrackerSettingsTab,
		private emotionGroup: EmotionGroup
	) {
		super(app, 
      `Delete emotion group "${emotionGroup.name}" ?`, 
      () =>	this.onConfirmation()
		);
	}

	async onConfirmation(): Promise<void> {
		this.plugin.settings.emotionGroups.remove(this.emotionGroup);
		this.plugin.saveSettings();
		this.settingsTab.display();
		this.close();
	}


}
