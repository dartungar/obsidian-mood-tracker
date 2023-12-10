import { App, Modal } from "obsidian";
import TrackerModal from "./TrackerModal.svelte";
import store from "src/store";
import MoodTrackerPlugin from "src/main";
import {
	IMoodTrackerEntry,
	MoodTrackerEntry,
} from "src/entities/MoodTrackerEntry";

export class MoodTrackerModal extends Modal {
	modal: TrackerModal;

	constructor(
		app: App,
		private plugin: MoodTrackerPlugin,
		private entry: IMoodTrackerEntry = new MoodTrackerEntry(),
		private reopenStatsModalOnClose: boolean = false
	) {
		super(app);
	}

	async onOpen() {
		store.plugin.set(this.plugin);

		this.modalEl.addClass("mood-tracker-modal");

		// reload data in case data file was synced / modified
		await this.plugin.loadEntries();

		this.modal = new TrackerModal({
			target: this.contentEl,
			props: {
				closeModalFunc: () => {
					if (this.reopenStatsModalOnClose) {
						this.plugin.openStatsModal(this.entry.dateTime);
					}
					this.close();
				},
				entry: this.entry,
			},
		});
	}

	onClose() {
		this.modal.$destroy();
	}
}
