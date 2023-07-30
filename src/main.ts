import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
import {
	DEFAULT_SETTINGS,
	MoodTrackerSettings,
} from "./settings/moodTrackerSettings";
import { MoodTrackerSettingsTab } from "./settings/settingsTab";
import { MoodTrackerModal } from "./trackerModal/trackerModal";
import { MoodTrackerService } from "./services/moodTrackerEntryService";
import { PersistenceService } from "./services/persistenceService";
import { IMoodTrackerEntry } from "./entities/MoodTrackerEntry";
import { MoodTrackerStatsModal } from "./statsModal/moodTrackerStatsModal";
import { getAverageMoodRatingByDay } from "./statsModal/statsHelpers";
import { EmotionSection } from "./entities/IEmotionSection";

import type moment from "moment";

declare global {
  interface Window {
    moment: typeof moment;
  }
}

export default class MoodTrackerPlugin extends Plugin {
	readonly dataFileName: string = "mood-tracker-data.json";
	settings: MoodTrackerSettings;
	entries: IMoodTrackerEntry[] = [];
	persistenceService: PersistenceService = new PersistenceService(this);
	moodTrackerService: MoodTrackerService = new MoodTrackerService(
		this.persistenceService
	);

	async onload() {
		await this.loadSettings();
		await this.loadEntries();

		this.addRibbonIcon(
			"smile-plus",
			"Open Mood Tracker",
			(evt: MouseEvent) => {
				new MoodTrackerModal(this.app, this).open();
			}
		);

		this.addCommand({
			id: "open-mood-tracker",
			name: "Open Tracker",
			callback: () => {
				new MoodTrackerModal(this.app, this).open();
			},
		});

		this.addRibbonIcon(
			"line-chart",
			"Open Mood Tracking History",
			(evt: MouseEvent) => {
				new MoodTrackerStatsModal(this.app, this).open();
			}
		);

		this.addCommand({
			id: "open-mood-tracker-history",
			name: "Open History",
			callback: () => {
				new MoodTrackerStatsModal(this.app, this).open();
			},
		});

		this.addSettingTab(new MoodTrackerSettingsTab(this, this.app));
	}

	onunload() {}

	async loadEntries() {
		this.entries = (await this.persistenceService.getEntries()) ?? [];
	
	}

	async saveEntries(): Promise<void> {
		await this.persistenceService.saveEntries();
	}

	async addEntry(entry: IMoodTrackerEntry): Promise<void> {
		this.entries.push(entry);
		await this.saveEntries();
	}

	public showNotice(message: string, durationMs: number = 5000) {
		new Notice(message, durationMs);
	}

	async loadSettings() {
		let loadedData: MoodTrackerSettings | any = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
		// look out for legacy settings!
		const legacyEmotions = loadedData.emotions;
		if (
			legacyEmotions &&
			Array.isArray(legacyEmotions) &&
			legacyEmotions.length > 0 &&
			typeof(legacyEmotions[0]) === 'string'
		) {
			const migratedSettings = new MoodTrackerSettings();
			migratedSettings.folderPath = loadedData.folderPath;
			migratedSettings.moodRatingLabelDict =
				loadedData.moodRatingLabelDict;
			const emotionSection = new EmotionSection();
			emotionSection.color = "#b8c1cf";
			emotionSection.name = "";
			emotionSection.emotions = legacyEmotions;
			migratedSettings.emotionSections = [];
			migratedSettings.emotionSections.push(emotionSection);
			this.settings = Object.assign(
				{},
				DEFAULT_SETTINGS,
				migratedSettings
			);
			this.showNotice(
				"Mood Tracker has been updated. Check out the new emotion settings!",
				15000
			);
			await this.saveSettings();
		} else {
			this.settings = loadedData; 
			await this.saveSettings();
		}
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
