import { Notice, Plugin } from "obsidian";
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
import { EmotionGroup } from "./entities/IEmotionGroup";

import type moment from "moment";
import { FileService } from "./filesIntegration/fileService";
import { DataIntegrityService } from "./services/dataIntegrityService";
import { EmotionsService } from "./services/emotionsService";
import { STATS_CODEBLOCK_NAME, StatsCodeblockRenderer } from "./stats/statsCodeblockRenderer";

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
	dataIntegrityService: DataIntegrityService = new DataIntegrityService();
	noteService = new FileService(this);
	emotionService = new EmotionsService(this);
	moodTrackerService: MoodTrackerService = new MoodTrackerService(
		this.persistenceService
	);
	activeStatsModel: MoodTrackerStatsModal;

	async onload() {
		await this.loadSettings();
		await this.loadEntries();
		this.addRibbonIcons();
		this.addCommands();
		this.addCodeblockRenderers();
		this.addSettingTab(new MoodTrackerSettingsTab(this, this.app));
	}

	onunload() {}

	openTrackerModal(
		entry: IMoodTrackerEntry | undefined = undefined,
		reopenStatsModalOnClose = false
	) {
		new MoodTrackerModal(
			this.app,
			this,
			entry,
			reopenStatsModalOnClose
		).open();
	}

	openStatsModal(selectedDate = new Date()) {
		if (this.activeStatsModel) {
			this.activeStatsModel.close();
		}
		this.activeStatsModel = new MoodTrackerStatsModal(
			this.app,
			this,
			selectedDate
		);
		this.activeStatsModel.open();
	}

	async loadEntries() {
		const loadedEntries =
			(await this.persistenceService.getEntries()) ?? [];
		this.entries = this.dataIntegrityService.safeMergeData(
			loadedEntries,
			this.entries
		);
	}

	async saveEntries(): Promise<void> {
		await this.persistenceService.saveEntries();
	}

	async saveEntry(entry: IMoodTrackerEntry): Promise<void> {
		const index = this.entries.findIndex((e) => e.id === entry.id);
		if (index === -1) {
			this.entries.push(entry);
		} else {
			this.entries[index] = entry;
		}
		await this.saveEntries();
	}

	async deleteEntry(entry: IMoodTrackerEntry): Promise<void> {
		const index = this.entries.findIndex((e) => e.id === entry.id);
		if (index !== -1) {
			this.entries.remove(entry);
		} 
		await this.saveEntries();
	}

	public showNotice(message: string, durationMs = 5000, title?: string) {
		if (typeof title !== 'undefined') {
			const notice = new Notice("", durationMs);
			notice.noticeEl.append(
				createEl("strong", { text: title, cls: "mood-tracker-notice-header"}),
				createEl("br"),
				message,
			);
		} else {
			new Notice(message, durationMs);
		}
	}

	async loadSettings() {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const loadedData: MoodTrackerSettings | any = Object.assign(
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
			typeof legacyEmotions[0] === "string"
		) {
			const migratedSettings = new MoodTrackerSettings();
			migratedSettings.folderPath = loadedData.folderPath;
			migratedSettings.moodRatingLabelDict =
				loadedData.moodRatingLabelDict;
			const emotionGroup = new EmotionGroup();
			emotionGroup.color = "#b8c1cf";
			emotionGroup.name = "";
			emotionGroup.emotions = legacyEmotions;
			migratedSettings.emotionGroups = [];
			migratedSettings.emotionGroups.push(emotionGroup);
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
			const legacyEmotionSections = loadedData.emotionSections;
			if (legacyEmotionSections) {
				const convertedLegacyEmotionSections =
					this.dataIntegrityService.legacyEmotionSectionsToEmotionGroups(
						legacyEmotionSections
					);
				this.settings.emotionGroups.push(
					...convertedLegacyEmotionSections
				);
				// @ts-expect-error
				this.settings["emotionSections"] = null;
				// @ts-expect-error
				delete this.settings["emotionSections"];
			}
			this.settings.emotionGroups = this.emotionService.sortEmotionGroups(
				this.settings.emotionGroups
			);
			this.dataIntegrityService.fillMissingIds(
				this.settings.emotionGroups
			);
			await this.saveSettings();
		}
	}

	async saveSettings() {
		this.settings.emotionGroups = this.emotionService.sortEmotionGroups(
			this.settings.emotionGroups
		);
		await this.saveData(this.settings);
	}

	private addRibbonIcons() {
		this.addRibbonIcon(
			"smile-plus",
			"Open Mood Tracker",
			(evt: MouseEvent) => {
				this.openTrackerModal();
			}
		);

		this.addRibbonIcon(
			"line-chart",
			"Open Mood Tracking History",
			(evt: MouseEvent) => {
				this.openStatsModal();
			}
		);
	}

	private addCommands() {
		this.addCommand({
			id: "open-mood-tracker",
			name: "Open Tracker",
			callback: () => {
				this.openTrackerModal();
			},
		});

		this.addCommand({
			id: "open-mood-tracker-history",
			name: "Open History",
			callback: () => {
				this.openStatsModal();
			},
		});
	}

	private addCodeblockRenderers() {
		this.registerMarkdownCodeBlockProcessor(STATS_CODEBLOCK_NAME, (source, el, ctx) => {
			const renderer = new StatsCodeblockRenderer(source, el, this);
			renderer.render();
		})
	}
}
