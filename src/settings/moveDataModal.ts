import { App, Modal } from "obsidian";
import MoodTrackerPlugin from "src/main";
import { MoodTrackerSettingsTab } from "./settingsTab";

export class MoveDataModal extends Modal {
	constructor(
		app: App,
		private _plugin: MoodTrackerPlugin,
		private settingsTab: MoodTrackerSettingsTab,
		private newPath: string
	) {
		super(app);
	}

	onOpen() {
        const adapter = this._plugin.app.vault.adapter;
        const oldPathFull = this._plugin.settings.folderPath + '/' + this._plugin.dataFileName;
        const newPathFull = this.newPath+ '/' + this._plugin.dataFileName;
		const { contentEl } = this;       
		this.titleEl.setText(
			`Move mood tracking data from "${this._plugin.settings.folderPath}" to "${this.newPath}" ?`
		);
		const btnsDiv = contentEl.createDiv();
		const okBtn = btnsDiv.createEl("button", { text: "Ok" });
        okBtn.style.marginRight = "0.5rem";
		okBtn.onClickEvent(async () => {
            try {
                await adapter.copy(oldPathFull, newPathFull);
                await this._plugin.loadEntries();
            } catch (error) {
                this._plugin.showNotice("Error moving mood tracking data. See console for details.");
                if (await adapter.exists(newPathFull)) {
                    await adapter.remove(newPathFull);
                }
                throw error;
            }
            
            await adapter.remove(oldPathFull);
			this._plugin.showNotice(`Successfully moved mood tracking data from "${this._plugin.settings.folderPath}" to "${this.newPath}".`);

			this._plugin.settings.folderPath = this.newPath;
			await this._plugin.saveSettings();
			this.close();
		});
		const cancelBtn = btnsDiv.createEl("button", { text: "Cancel" });
		cancelBtn.onClickEvent(() => this.close());
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
