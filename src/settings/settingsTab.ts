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
import { t } from "src/i18n";

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

		setting.setName(t("settings.trackerModalTitle.name"))
		setting.setDesc(t("settings.trackerModalTitle.desc"));

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

		setting.setName(t("settings.folderPath.name"));
		setting.setDesc(t("settings.folderPath.desc"));

		setting.addText((text) => {
			text.inputEl.style.width = "min(335px, 35vw)";
			text.setPlaceholder(t("settings.folderPath.placeholder"))
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
					text.inputEl.title = t("settings.folderPath.folderNotExist");
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
			button.setButtonText(t("settings.folderPath.apply"))
			.onClick(async () => {
				new MoveDataModal(this.app, this._plugin, path).open();
			})
		})
	}

	private addAddToNoteSettings() {
		const setting = new Setting(this.containerEl);

		setting.setName(t("settings.addToJournal.name"));
		setting.setDesc(t("settings.addToJournal.desc"));

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

		setting.setName(t("settings.chartColor.name"))
		setting.setDesc(t("settings.chartColor.desc"));

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

		setting.setName(t("settings.moodRatingLabels.name"))
		setting.setDesc(t("settings.moodRatingLabels.desc"));

		setting.addButton((button) => {
			button.setButtonText(t("settings.moodRatingLabels.edit"))
			.onClick(async () => {
				new MoodRatingLabelsEditModal(this._plugin, app).open();
			})
		})
	}

	private addJournalPathSetting() {
		const setting = new Setting(this.containerEl);

		setting.setName(t("settings.journalPath.name"));
		setting.setDesc(t("settings.journalPath.desc"));

		setting.addText((input) => {
			input.inputEl.style.width = "min(400px, 35vw)";
			input.setValue(this._plugin.settings.journalFilePath)
			.onChange(async (value) => {
				this._plugin.settings.journalFilePath = value;
				await this._plugin.saveSettings();
			});

		})
	}

	private addJournalLocation() {
		const setting = new Setting(this.containerEl);

		setting.setName(t("settings.journalLocation.name"));
		setting.setDesc(t("settings.journalLocation.desc"));

		setting.addText((input) => {
			input.inputEl.style.width = "min(400px, 35vw)";
			input.setValue(this._plugin.settings.journalPosition)
			.onChange(async (value) => {
				this._plugin.settings.journalPosition = value;
				await this._plugin.saveSettings();
			});

		})
	}

	private addTemplateSetting() {
		const setting = new Setting(this.containerEl);

		setting.setName(t("settings.entryTemplate.name"));
		setting.setDesc(t("settings.entryTemplate.desc"));

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

		setting.setName(t("settings.useEmotions.name"))
		setting.setDesc(t("settings.useEmotions.desc"));

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

		setting.setName(t("settings.sortEmotions.name"))
		setting.setDesc(t("settings.sortEmotions.desc"));

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
		const settingGroupEl = this.containerEl.createEl("div");
		settingGroupEl.createEl("h4", { text: t("settings.emotionGroups.name") });
		settingGroupEl.createEl("small", {
			text: t("settings.emotionGroups.desc"),
		});

		for (const [
			index,
			emotionGroup,
		] of this._plugin.settings.emotionGroups.entries()) {

			const setting = new Setting(settingGroupEl);

			setting.setName(emotionGroup.name ?? `${t("settings.emotionGroups.name")} ${index}`);

			// TODO: text color

			setting.addExtraButton(cb => {
				cb.setIcon('arrow-up')
				.setTooltip(t("settings.emotionGroups.moveUp"))
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
				.setTooltip(t("settings.emotionGroups.moveDown"))
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
					.setTooltip(t("settings.emotionGroups.edit"))
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
					.setTooltip(t("settings.emotionGroups.delete"))
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
		addMoodSectionBtn.setButtonText(t("settings.emotionGroups.add"));
		addMoodSectionBtn.onClick(async () => {
			this._plugin.settings.emotionGroups.push(new EmotionGroup());
			await this._plugin.saveSettings();
			this.display();
		});
	}
}
