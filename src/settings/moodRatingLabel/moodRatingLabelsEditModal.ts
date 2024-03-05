import { App, Modal } from "obsidian";
import MoodRatingLabelsEditComponent from "./MoodRatingLabelsEditComponent.svelte";
import MoodTrackerPlugin from "src/main";
import store from "src/store";



export class MoodRatingLabelsEditModal extends Modal {
    component: MoodRatingLabelsEditComponent;

    constructor(private _plugin: MoodTrackerPlugin, app: App) {
        super(app);
    }

    onOpen(): void {
        store.plugin.set(this._plugin);

        this.titleEl.innerText = "Edit mood rating labels";

        this.component = new MoodRatingLabelsEditComponent({
            target: this.contentEl,
            props: {
                closeModalFunc: () => this.close()
            }
        });
    }

    onClose() {
        this.component.$destroy();
    }
}