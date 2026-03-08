import { ConfirmationModal } from "src/common/confirmationModal";
import { IMoodTrackerEntry } from "src/entities/MoodTrackerEntry";
import MoodTrackerPlugin from "src/main";
import { t, formatDate } from "src/i18n";

export class DeleteEntryModal extends ConfirmationModal {

    constructor(private plugin: MoodTrackerPlugin, entry: IMoodTrackerEntry, private onDeleteCallback: (e: IMoodTrackerEntry) => void) {
        super(plugin.app, t("modals.deleteEntry.title"), () => this.deleteEntry(entry));
        this.setContent(t("modals.deleteEntry.message", { date: formatDate(entry.dateTime) }))
    }

    async deleteEntry(entry: IMoodTrackerEntry): Promise<void> {
        await this.plugin.deleteEntry(entry);
        this.onDeleteCallback(entry);
        this.close();
    }
}