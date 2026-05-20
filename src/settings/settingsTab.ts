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
			this.addJournalLocation();
			this.addTemplateSetting();
		}

		this.addUseSortingSetting();

		
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
			input.inputEl.addClass("mood-tracker-setting-input-wide");
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
			text.inputEl.addClass("mood-tracker-setting-input-medium");
			text.setPlaceholder("data/")
				.setValue(this._plugin.settings.folderPath)
				.onChange(debounce(async (value) => {
					if (value === this._plugin.settings.folderPath) {
						text.inputEl.removeClass("mood-tracker-setting-input-invalid");
						text.inputEl.removeAttribute("title");
						path = value;
						return;
					}

					if (await this.app.vault.adapter.exists(value)) {
						text.inputEl.removeClass("mood-tracker-setting-input-invalid");
						text.inputEl.removeAttribute("title");
						path = value;
						return;
					}
					text.inputEl.addClass("mood-tracker-setting-input-invalid");
					text.inputEl.title = "Folder does not exist";
				}, 500, true));

			new GenericTextSuggester(
				this.app,
				text.inputEl,
				this.app.vault
					.getAllLoadedFiles()
					.filter((f) => f instanceof TFolder && f.path !== "/")
					.map((f) => f.path)
			);
		});

		setting.addButton((button) => {
			button.setButtonText("Apply")
			.onClick(() => {
				new MoveDataModal(this.app, this._plugin, path).open();
			})
		})
	}

	private addAddToNoteSettings() {
		const setting = new Setting(this.containerEl);

		setting.setName("Add mood tracking info to a note");
		setting.setDesc(createFragment((fragment) => {
			fragment.appendText("When adding a mood tracker entry, also add its info to a note (e.g daily journal).");
			fragment.createEl("br");
			fragment.appendText("This is for journaling purposes only; main data is still stored in data.json");
		}));

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

		setting.setName("Chart color")
		setting.setDesc("Primary color for the chart elements (e.g line or bar).");

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
			.onClick(() => {
				new MoodRatingLabelsEditModal(this._plugin, this.app).open();
			})
		})
	}

	private addJournalPathSetting() {
		const setting = new Setting(this.containerEl);

		setting.setName("Note path");
		setting.setDesc(createFragment((fragment) => {
			fragment.appendText("Use a static file path, or {{DATE}} variable.");
			fragment.createEl("br");
			fragment.appendText("Supports ");
			fragment.createEl("a", {
				text: "moment.js formatting",
				href: "https://momentjs.com/docs/#/displaying/format/",
				attr: {
					target: "_blank",
					rel: "noopener",
				},
			});
			fragment.appendText(".");
			fragment.createEl("br");
			fragment.appendText("Example: journals/daily/{{DATE:YYYY-MM-DD}}.md");
		}));

		setting.addText((input) => {
			input.inputEl.addClass("mood-tracker-setting-input-wide");
			input.setValue(this._plugin.settings.journalFilePath)
			.onChange(async (value) => {
				this._plugin.settings.journalFilePath = value;
				await this._plugin.saveSettings();
			});

		})
	}

	private addJournalLocation() {
		const setting = new Setting(this.containerEl);

		setting.setName("Entry location");
		setting.setDesc(createFragment((fragment) => {
			fragment.appendText("Where in the journal should the Mood-Tracker entry be placed?");
			fragment.createEl("br");
			fragment.appendText("Example: ## Mood Tracker");
		}));

		setting.addText((input) => {
			input.inputEl.addClass("mood-tracker-setting-input-wide");
			input.setValue(this._plugin.settings.journalPosition)
			.onChange(async (value) => {
				this._plugin.settings.journalPosition = value;
				await this._plugin.saveSettings();
			});

		})
	}

	private addTemplateSetting() {
		const setting = new Setting(this.containerEl);

		setting.setName("Template for inserting mood tracking entry in a note");
		setting.setDesc(createFragment((fragment) => {
			fragment.appendText("Available variables:");
			fragment.createEl("br");
			fragment.appendText("{{DATE}} - date of entry");
			fragment.createEl("br");
			fragment.appendText("{{TIME}} - time of entry - supports custom formatting - eg: {{TIME:HH-mm-ss}}");
			fragment.createEl("br");
			fragment.appendText("{{ICON}} - entry's mood icon");
			fragment.createEl("br");
			fragment.appendText("{{LINEBREAK}} - begins new line");
			fragment.createEl("br");
			fragment.appendText("{{NOTE}} - entry's note");
			fragment.createEl("br");
			fragment.appendText("{{EMOTIONS}} - comma-separated list of emotions, if any");
		}));

		setting.addText((input) => {
			input.inputEl.addClass("mood-tracker-setting-input-wide");
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

	private addUseSortingSetting() {
		const setting = new Setting(this.containerEl);

		setting.setName("Sort emotions alphabetically")
		setting.setDesc("Sort emotions within each group alphabetically");

		setting.addToggle((input) => {
			input.setValue(this._plugin.settings.sortEmotionsAlphabetically)
			.onChange(async (value) => {
				this._plugin.settings.sortEmotionsAlphabetically = value;
				await this._plugin.saveSettings();
				this.display();
			});
		})
	}


	private addEmotionsSetting() {
		const settingGroupEl = this.containerEl.createDiv();
		new Setting(settingGroupEl)
			.setName("Emotions")
			.setDesc("A list of emotions, separated by commas or newlines. You can define one or many emotion groups, each with own color, if needed.")
			.setHeading();

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
						void this.moveEmotionGroup(index, index - 1);
					}
				})
			});
	
			setting.addExtraButton(cb => {
				cb.setIcon('arrow-down')
				.setTooltip("Move element down")
				.setDisabled(index >= this._plugin.settings.emotionGroups.length - 1)
				.onClick(() => {
					if (index < this._plugin.settings.emotionGroups.length - 1) {
						void this.moveEmotionGroup(index, index + 1);
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
					.onClick(() => {
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
		addMoodSectionBtn.onClick(() => {
			void this.addEmotionGroup();
		});
	}

	private async moveEmotionGroup(index: number, targetIndex: number): Promise<void> {
		const targetGroup = this._plugin.settings.emotionGroups[targetIndex];
		const emotionGroup = this._plugin.settings.emotionGroups[index];
		const temp = targetGroup.sortOrder;
		targetGroup.sortOrder = emotionGroup.sortOrder;
		emotionGroup.sortOrder = temp;
		await this._plugin.saveSettings();
		this.display();
	}

	private async addEmotionGroup(): Promise<void> {
		this._plugin.settings.emotionGroups.push(new EmotionGroup());
		await this._plugin.saveSettings();
		this.display();
	}
}
