import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { DEFAULT_SETTINGS, MoodTrackerSettings } from './settings/moodTrackerSettings';
import { MoodTrackerSettingsTab } from './settings/settingsTab';
import { MoodTrackerModal } from './trackerModal/trackerModal';
import { MoodTrackerService } from './services/moodTrackerEntryService';
import { PersistenceService } from './services/persistenceService';
import { IMoodTrackerEntry } from './entities/MoodTrackerEntry';
import { MoodTrackerStatsModal } from './statsModal/moodTrackerStatsModal';
import { getAverageMoodRatingByDay } from './statsModal/statsHelpers';


export default class MoodTrackerPlugin extends Plugin {
	readonly dataFileName: string = "mood-tracker-data.json";
	settings: MoodTrackerSettings;
	entries: IMoodTrackerEntry[] = [];
	persistenceService: PersistenceService = new PersistenceService(this);
	moodTrackerService: MoodTrackerService = new MoodTrackerService(this.persistenceService);

	async onload() {
		await this.loadSettings();
		await this.loadEntries();

		this.addRibbonIcon('smile-plus', 'Mood Tracker', (evt: MouseEvent) => {
			new MoodTrackerModal(this.app, this).open();
		});

		this.addRibbonIcon('line-chart', 'Mood Tracking Stats', (evt: MouseEvent) => {
			new MoodTrackerStatsModal(this.app, this).open();
		});


		this.addSettingTab(new MoodTrackerSettingsTab(this, this.app));
	}

	onunload() {

	}

	async loadEntries() {
		this.entries = await this.persistenceService.getEntries() ?? [];
		console.log("loaded entries:", this.entries);
		console.log("these entries give this data:", getAverageMoodRatingByDay(this.entries));
	}

	async saveEntries(): Promise<void> {
		await this.persistenceService.saveEntries();
	}

	async addEntry(entry: IMoodTrackerEntry): Promise<void> {
		this.entries.push(entry);
		await this.saveEntries();
	}

	public showNotice(message: string) {
		new Notice(message, 5000);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

}
