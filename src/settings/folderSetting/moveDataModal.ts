import { App } from "obsidian";
import { ConfirmationModal } from "src/common/confirmationModal";
import MoodTrackerPlugin from "src/main";
import { t } from "src/i18n";

export class MoveDataModal extends ConfirmationModal {
	constructor(
		app: App,
		private _plugin: MoodTrackerPlugin,
		private newPath: string
	) {
		super(
			app,
			t("modals.moveData.message", { from: _plugin.settings.folderPath, to: newPath }),
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
				t("notifications.errorMovingData")
			);
			if (await adapter.exists(newPathFull)) {
				await adapter.remove(newPathFull);
			}
			throw error;
		}

		await adapter.remove(oldPathFull);
		this._plugin.showNotice(
			t("notifications.dataFileMoved")
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
