import { App } from "obsidian";
import { ConfirmationModal } from "src/common/confirmationModal";
import MoodTrackerPlugin from "src/main";

export class MoveDataModal extends ConfirmationModal {
	constructor(
		app: App,
		private _plugin: MoodTrackerPlugin,
		private newPath: string
	) {
		super(
			app,
			`Move mood tracking data from "${_plugin.settings.folderPath}" to "${newPath}" ?`,
			() => this.onConfirmation()
		);
	}


	async onConfirmation(): Promise<void> {
		const adapter = this._plugin.app.vault.adapter;
		const oldPathFull =	this._plugin.settings.folderPath + "/" + this._plugin.dataFileName;
		const newPathFull = this.newPath + "/" + this._plugin.dataFileName;
		try {
			await adapter.copy(oldPathFull, newPathFull);
			await this._plugin.loadEntries();
		} catch (error) {
			this._plugin.showNotice(
				"Error moving mood tracking data. See console for details."
			);
			if (await adapter.exists(newPathFull)) {
				await adapter.remove(newPathFull);
			}
			throw error;
		}

		await adapter.remove(oldPathFull);
		this._plugin.showNotice(
			`Successfully moved mood tracking data from "${this._plugin.settings.folderPath}" to "${this.newPath}".`
		);

		this._plugin.settings.folderPath = this.newPath;
		await this._plugin.saveSettings();
		this.close();
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
