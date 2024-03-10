import { ConfirmationModal } from "src/common/confirmationModal";
import { IMoodTrackerEntry } from "src/entities/MoodTrackerEntry";
import MoodTrackerPlugin from "src/main";

export class DeleteEntryModal extends ConfirmationModal {

    constructor(private plugin: MoodTrackerPlugin, entry: IMoodTrackerEntry, private onDeleteCallback: (e: IMoodTrackerEntry) => void) {
        super(plugin.app, "Delete mood tracking entry", () => this.deleteEntry(entry));
        this.setContent(`Delete mood tracking entry for ${entry.dateTime}?`)
    }

    async deleteEntry(entry: IMoodTrackerEntry): Promise<void> {
        await this.plugin.deleteEntry(entry);
        this.onDeleteCallback(entry);
        this.close();
    }
}