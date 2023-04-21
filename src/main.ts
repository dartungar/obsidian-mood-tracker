import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { DEFAULT_SETTINGS, MoodTrackerSettings } from './settings/moodTrackerSettings';
import { MoodTrackerSettingsTab } from './settings/settingsTab';
import { MoodTrackerModal } from './trackerModal/trackerModal';


export default class MoodTrackerPlugin extends Plugin {
	settings: MoodTrackerSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('smile-plus', 'Mood Tracker', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new MoodTrackerModal(this.app, this).open();
		});
		// Perform additional things with the ribbon


		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new MoodTrackerSettingsTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
