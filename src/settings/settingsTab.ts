import {
	App,
	ButtonComponent,
	debounce,
	PluginSettingTab,
	Setting,
	TFolder,
} from "obsidian";
import MoodTrackerPlugin from "src/main";
import { GenericTextSuggester } from "./folderSetting/fileSuggester";
import { EmotionGroup } from "src/entities/IEmotionGroup";
import { MoveDataModal } from "./folderSetting/moveDataModal";
import { EmotionGroupEditModal } from "./emotionGroup/emotionGroupEditModal";
import { EmotionGroupDeleteModal } from "./emotionGroup/emotionGroupDeleteModal";
import { MoodRatingLabelsEditModal } from "./moodRatingLabel/moodRatingLabelsEditModal";

export class MoodTrackerSettingsTab extends PluginSettingTab {
	constructor(private _plugin: MoodTrackerPlugin, app: App) {
		super(app, _plugin);
	}

	display() {
		const { containerEl } = this;

		containerEl.empty();

		this.addTrackerModalTitleSetting();
		this.addFolderPathSetting();
		this.addChartColorSetting();
		this.addMoodRatingLabelsSetting();
		this.addAddToNoteSettings();
		if (this._plugin.settings.addToJournal) {
			this.addJournalPathSetting();
			this.addTemplateSetting();
		}
		
		this.addUseEmotionsSetting();
		if (this._plugin.settings.useEmotions) {
			this.addEmotionsSetting();
		}
	}

	private addTrackerModalTitleSetting() {
		const setting = new Setting(this.containerEl);

		setting.setName("Tracker modal title")
		setting.setDesc("Title for mood tracker modal");

		setting.addText((input) => {
			input.inputEl.style.width = "min(400px, 35vw)";
			input.setValue(this._plugin.settings.trackerModalTitle)
			.onChange(async (value) => {
				this._plugin.settings.trackerModalTitle = value;
				await this._plugin.saveSettings();
			});
		})
	}

	// by C.Houmann (https://github.com/chhoumann/quickadd)
	// TODO: try to implement better one, maybe look outside of obsidian plugins
	private addFolderPathSetting() {
		const setting = new Setting(this.containerEl);
		let path = this._plugin.settings.folderPath;

		setting.setName("Folder to store data file");
		setting.setDesc(
			"A path to a folder where mood tracker data will be stored."
		);

		setting.addText((text) => {
			text.inputEl.style.width = "min(335px, 35vw)";
			text.setPlaceholder("data/")
				.setValue(this._plugin.settings.folderPath)
				.onChange(debounce(async (value) => {
					if (value === this._plugin.settings.folderPath) {
						return;
					}

					if (await this.app.vault.adapter.exists(value)) {
						text.inputEl.removeAttribute("style");
						text.inputEl.removeAttribute("title");
						path = value;
						return;
					}
					text.inputEl.style.border = "1px solid red";
					text.inputEl.title = "Folder does not exist";
				}, 500, true));

			new GenericTextSuggester(
				app,
				text.inputEl,
				app.vault
					.getAllLoadedFiles()
					.filter((f) => f instanceof TFolder && f.path !== "/")
					.map((f) => f.path)
			);
		});

		setting.addButton((button) => {
			button.setButtonText("Apply")
			.onClick(async () => {
				new MoveDataModal(this.app, this._plugin, path).open();
			})
		})
	}

	private addAddToNoteSettings() {
		const setting = new Setting(this.containerEl);

		setting.setName("Add mood tracking info to a note");
		setting.descEl.innerHTML = `When adding a mood tracker entry, also add its info to a note (e.g daily journal).<br> 
		This is for journaling purposes only; main data is still stored in data.json`;

		setting.addToggle((input) => {
			input.setValue(this._plugin.settings.addToJournal)
			.onChange(async (value) => {
				this._plugin.settings.addToJournal = value;
				await this._plugin.saveSettings();
				this.display();
			});

		})
	}

	private addChartColorSetting() {
		const setting = new Setting(this.containerEl);

		setting.setName("Mood rating labels")
		setting.setDesc("Labels to use for mood rating. Used in tracker modal and stats.");

		setting.addColorPicker((picker) => {
			picker.setValue(this._plugin.settings.chartColor ?? "#000")
			.onChange(async (value) => {
				this._plugin.settings.chartColor = value;
				await this._plugin.saveSettings();
			})
		})
	}

	private addMoodRatingLabelsSetting() {
		const setting = new Setting(this.containerEl);

		setting.setName("Mood rating labels")
		setting.setDesc("Labels to use for mood rating. Used in tracker modal and stats.");

		setting.addButton((button) => {
			button.setButtonText("Edit")
			.onClick(async () => {
				new MoodRatingLabelsEditModal(this._plugin, app).open();
			})
		})
	}

	private addJournalPathSetting() {
		const setting = new Setting(this.containerEl);

		setting.setName("Note path");
		setting.descEl.innerHTML = `Use a static file path, or {{DATE}} variable.<br>
		Supports <a href="https://momentjs.com/docs/#/displaying/format/" target="_blank">moment.js formatting</a>.<br>
		Example: journals/daily/{{DATE:YYYY-MM-DD}}.md
		`

		setting.addText((input) => {
			input.inputEl.style.width = "min(400px, 35vw)";
			input.setValue(this._plugin.settings.journalFilePath)
			.onChange(async (value) => {
				this._plugin.settings.journalFilePath = value;
				await this._plugin.saveSettings();
			});

		})
	}

	private addTemplateSetting() {
		const setting = new Setting(this.containerEl);

		setting.setName("Template for inserting mood tracking entry in a note");
		setting.descEl.innerHTML = `Available variables:<br>
		{{DATE}} - date of entry <br>
		{{TIME}} - time of entry <br>
		{{ICON}} - entry's mood icon <br>
		{{NOTE}} - entry's note <br>
		{{EMOTIONS}} - comma-separated list of emotions, if any <br>
		`;

		setting.addText((input) => {
			input.inputEl.style.width = "min(400px, 35vw)";
			input.setValue(this._plugin.settings.entryTemplate)
			.onChange(async (value) => {
				this._plugin.settings.entryTemplate = value;
				await this._plugin.saveSettings();
			});

		})
	}



	private addUseEmotionsSetting() {
		const setting = new Setting(this.containerEl);

		setting.setName("Use emotions")
		setting.setDesc("Track more nuanced emotions in addition to simple mood rating");

		setting.addToggle((input) => {
			input.setValue(this._plugin.settings.useEmotions)
			.onChange(async (value) => {
				this._plugin.settings.useEmotions = value;
				await this._plugin.saveSettings();
				this.display();
			});
		})
	}

	private addEmotionsSetting() {
		const settingGroupEl = this.containerEl.createEl("div");
		settingGroupEl.createEl("h4", { text: "Emotions" });
		settingGroupEl.createEl("small", {
			text: "A list of emotions, separated by commas or newlines. You can define one or many emotion groups, each with own color, if needed.",
		});

		for (const [
			index,
			emotionGroup,
		] of this._plugin.settings.emotionGroups.entries()) {
			const setting = new Setting(settingGroupEl);

			setting.setName(emotionGroup.name ?? `Emotions group ${index}`);

			// TODO: text color

			setting.addExtraButton(cb => {
				cb.setIcon('arrow-up')
				.setTooltip("Move element up")
				.setDisabled(index === 0)
				.onClick(() => {
					if (index > 0) {
						const temp = this._plugin.settings.emotionGroups[index - 1].sortOrder;
						this._plugin.settings.emotionGroups[index - 1].sortOrder = emotionGroup.sortOrder;
						emotionGroup.sortOrder = temp;
						this._plugin.saveSettings();
						this.display();
					}
				})
			});
	
			setting.addExtraButton(cb => {
				cb.setIcon('arrow-down')
				.setTooltip("Move element down")
				.setDisabled(index >= this._plugin.settings.emotionGroups.length - 1)
				.onClick(() => {
					if (index < this._plugin.settings.emotionGroups.length - 1) {
						const temp = this._plugin.settings.emotionGroups[index + 1].sortOrder;
						this._plugin.settings.emotionGroups[index + 1].sortOrder = emotionGroup.sortOrder;
						emotionGroup.sortOrder = temp;
						this._plugin.saveSettings();
						this.display();
					}
				})
			});

			setting.addExtraButton((cb) => {
				cb.setIcon("edit")
					.setTooltip("Edit Group")
					.onClick(() => {
						const modal = new EmotionGroupEditModal(this._plugin, emotionGroup, this.app);
						modal.open();
						modal.onClose = () => {
							this.display();
						};
					});
			});

			setting.addExtraButton((cb) => {
				cb.setIcon("trash")
					.setTooltip("Delete note set")
					.onClick(async () => {
						new EmotionGroupDeleteModal(
							this.app,
							this._plugin,
							this,
							emotionGroup,
						).open();
					});
			});

		}

		const addMoodSectionBtn = new ButtonComponent(settingGroupEl);
		addMoodSectionBtn.setButtonText("Add Group");
		addMoodSectionBtn.onClick(async () => {
			this._plugin.settings.emotionGroups.push(new EmotionGroup());
			await this._plugin.saveSettings();
			this.display();
		});
	}
}
