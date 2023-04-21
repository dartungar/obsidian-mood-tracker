import { App, Modal } from "obsidian";
import  ModalComponent from "./ModalComponent.svelte";
import store from "src/store";
import MoodTrackerPlugin from "src/main";


export class MoodTrackerModal extends Modal {
    modal: ModalComponent;

    constructor(app: App, private plugin: MoodTrackerPlugin) {
        super(app);
    }

    onOpen() {
        store.plugin.set(this.plugin);

        this.modalEl.addClass("mood-tracker-modal");

        console.log("store", store, "plugin", this.plugin);

        this.modal = new ModalComponent({
            target: this.contentEl,
            props: {
            }
        });
    }

    onClose() {
        this.modal.$destroy();
    }
}