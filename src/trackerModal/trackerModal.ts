import { App, Modal } from "obsidian";
import  TrackerModal from "./TrackerModal.svelte";
import store from "src/store";
import MoodTrackerPlugin from "src/main";


export class MoodTrackerModal extends Modal {
    modal: TrackerModal;

    constructor(app: App, private plugin: MoodTrackerPlugin) {
        super(app);
    }

    onOpen() {
        store.plugin.set(this.plugin);

        this.modalEl.addClass("mood-tracker-modal");

        this.modal = new TrackerModal({
            target: this.contentEl,
            props: {
                closeModalFunc: () => this.close(),
            }
        });
    }

    onClose() {
        this.modal.$destroy();
    }
}