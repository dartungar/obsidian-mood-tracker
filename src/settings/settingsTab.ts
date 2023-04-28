import { App, PluginSettingTab, Setting, TFolder } from "obsidian";
import MoodTrackerPlugin from "src/main";
import { DEFAULT_SETTINGS } from "./moodTrackerSettings";
import { GenericTextSuggester } from "./fileSuggester";


export class MoodTrackerSettingsTab extends PluginSettingTab {

    constructor(private _plugin: MoodTrackerPlugin, app: App) {
        super(app, _plugin);
    }

    display() {
        const { containerEl } = this;

        containerEl.empty();

		containerEl.createEl('h2', { text: 'Mood Tracker Settings' });

        this.addFolderPathSetting();
    }

    // by C.Houmann (https://github.com/chhoumann/quickadd)
    private addFolderPathSetting() {
        const setting = new Setting(this.containerEl);

		setting.setName("Folder to store data file");
		setting.setDesc(
			"A path to a folder where mood tracker data will be stored."
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

}