import {
	App,
	ButtonComponent,
	PluginSettingTab,
	Setting,
	TFolder,
} from "obsidian";
import MoodTrackerPlugin from "src/main";
import { GenericTextSuggester } from "./fileSuggester";
import { EmotionSection } from "src/entities/IEmotionSection";

export class MoodTrackerSettingsTab extends PluginSettingTab {
	constructor(private _plugin: MoodTrackerPlugin, app: App) {
		super(app, _plugin);
	}

	display() {
		const { containerEl } = this;

		containerEl.empty();

		this.addFolderPathSetting();
		this.addTemplateSetting();
		this.addEmotionsSetting();
	}

	// by C.Houmann (https://github.com/chhoumann/quickadd)
	private addFolderPathSetting() {
		const setting = new Setting(this.containerEl);

		setting.setName("Folder to store data file");
		setting.setDesc(
			"A path to a folder where mood tracker data will be stored. If you change this, you will need to move the data file manually."
		);

		setting.addText((text) => {
			text.setPlaceholder("data/")
				.setValue(this._plugin.settings.folderPath)
				.onChange(async (value) => {
					if (await this.app.vault.adapter.exists(value)) {
						text.inputEl.removeAttribute("style");
						text.inputEl.removeAttribute("title");
						this._plugin.settings.folderPath = value;
						await this._plugin.saveSettings();
						// TODO: move file to new location
						return;
					}

					text.inputEl.style.border = "1px solid red";
					text.inputEl.title = "Folder does not exist";
				});

			new GenericTextSuggester(
				app,
				text.inputEl,
				app.vault
					.getAllLoadedFiles()
					.filter((f) => f instanceof TFolder && f.path !== "/")
					.map((f) => f.path)
			);
		});
	}

	private addTemplateSetting() {
		const setting = new Setting(this.containerEl);

		setting.setName("Template for inserting mood tracking entry in a note")
		setting.setDesc("Available variables: {{TIME}} (time of entry), {{ICON}} (entry's mood icon), {{EMOTIONS}} (comma-separated list of emotions, if any), {{NOTE}} (entry's note)");

		setting.addTextArea((input) => {
			input.setValue(this._plugin.settings.template)
			.onChange(async (value) => {
				this._plugin.settings.template = value;
				await this._plugin.saveSettings();
			});

		})
	}

	private addEmotionsSetting() {
		const settingGroupEl = this.containerEl.createEl("div");
		settingGroupEl.createEl("h4", { text: "Emotions (moods)" });
		settingGroupEl.createEl("p", {
			text: "A list of emotions (moods), separated by commas or newlines. You will be able to choose one or more of these when adding a new mood tracker entry.\n You can add more sections for convenience via button at the bottom.",
		});

		for (const [
			index,
			moodSection,
		] of this._plugin.settings.emotionSections.entries()) {
			const setting = new Setting(settingGroupEl);

			setting.setName("Emotions (moods) section");

			// TODO: color! color -> hover & border in mood picker

			//setting.addColorPicker();
			setting.addColorPicker((input) => {
				input.setValue(moodSection.color).onChange(async (value) => {
					this._plugin.settings.emotionSections[index].color = value;
					await this._plugin.saveSettings();
				});
			});

			setting.addTextArea((input) => {
				input.inputEl.style.minHeight = "120px";
				input.inputEl.style.maxHeight = "300px";
				input.inputEl.style.maxWidth = "180px";
				input
					.setValue(moodSection.emotions.join("\n"))
					.onChange(async (value) => {
						this._plugin.settings.emotionSections[index].emotions =
							value.split(/[\n,]/g);
						await this._plugin.saveSettings();
					});
			});

			setting.addButton((input) => {
				input.setButtonText("Delete").onClick(async (value) => {
					this._plugin.settings.emotionSections.splice(index, 1);
					await this._plugin.saveSettings();
					this.display();
				});
			});

			//setting.addButton(())
		}

		const addMoodSectionBtn = new ButtonComponent(settingGroupEl);
		addMoodSectionBtn.setButtonText("Add Section");
		addMoodSectionBtn.onClick(async () => {
			this._plugin.settings.emotionSections.push(new EmotionSection());
			await this._plugin.saveSettings();
			this.display();
		});
	}
}
