import { App, Modal } from "obsidian";
import  StatsModal from "./StatsModal.svelte";
import store from "src/store";
import MoodTrackerPlugin from "src/main";


export class MoodTrackerStatsModal extends Modal {
    modal: StatsModal;

    constructor(app: App, private plugin: MoodTrackerPlugin) {
        super(app);
    }

    onOpen() {
        store.plugin.set(this.plugin);

        this.modalEl.addClass("mood-tracker-modal");

        this.modal = new StatsModal({
            target: this.contentEl,
            props: {
            }
        });
    }

    onClose() {
        this.modal.$destroy();
    }
}