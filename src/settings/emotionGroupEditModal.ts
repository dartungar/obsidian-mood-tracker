import { EmotionGroup } from "src/entities/IEmotionGroup";
import { App, Modal } from "obsidian";
import store from "src/store";
import MoodTrackerPlugin from "src/main";
import EmotionsGroupEditComponent from "./EmotionGroupEditComponent.svelte";

export class EmotionGroupEditModal extends Modal {
    component: EmotionsGroupEditComponent;

    constructor(private _plugin: MoodTrackerPlugin, private _emotionGroup: EmotionGroup, app: App) {
        super(app);
    }

    onOpen(): void {
        store.plugin.set(this._plugin);

        this.modalEl.addClass("mood-tracker-modal");
        this.titleEl.innerText = "Edit emotion group";

        this.component = new EmotionsGroupEditComponent({
            target: this.contentEl,
            props: {
                emotionGroup: this._emotionGroup,
                closeModalFunc: () => this.close()
            }
        });
    }

    onClose() {
        this.component.$destroy();
    }
}