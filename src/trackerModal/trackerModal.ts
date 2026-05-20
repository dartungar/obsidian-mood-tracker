import { App, Modal } from "obsidian";
import TrackerModal from "./TrackerModal.svelte";
import store from "src/store";
import MoodTrackerPlugin from "src/main";
import {
	IMoodTrackerEntry,
	MoodTrackerEntry,
} from "src/entities/MoodTrackerEntry";

export class MoodTrackerModal extends Modal {
	modal: TrackerModal | undefined;

	constructor(
		app: App,
		private plugin: MoodTrackerPlugin,
		private entry: IMoodTrackerEntry = new MoodTrackerEntry(),
		private reopenStatsModalOnClose: boolean = false
	) {
		super(app);
	}

	onOpen() {
		store.plugin.set(this.plugin);

		this.modalEl.addClass("mood-tracker-modal");

		void this.renderTracker().catch((error: unknown) => {
			console.error("Mood Tracker failed to open tracker modal", error);
			this.plugin.showNotice("Mood Tracker failed to open tracker. See console for details.");
		});
	}

	private async renderTracker(): Promise<void> {
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
		this.modal?.$destroy();
	}
}
