import { App, Modal } from "obsidian";
import  StatsComponent from "./StatsComponent.svelte";
import store from "src/store";
import MoodTrackerPlugin from "src/main";


export class MoodTrackerStatsModal extends Modal {
    component: StatsComponent;

    constructor(app: App, private plugin: MoodTrackerPlugin) {
        super(app);
    }

    onOpen() {
        store.plugin.set(this.plugin);

        this.modalEl.addClass("mood-tracker-modal");

        this.component = new StatsComponent({
            target: this.contentEl,
            props: {
            }
        });
    }

    onClose() {
        this.component.$destroy();
    }
}