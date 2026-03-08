import { MoodTrackerEntry } from "src/entities/MoodTrackerEntry";
import MoodTrackerPlugin from "src/main";
import { t } from "src/i18n";


export class PersistenceService {
    private get filepath(): string { 
        return this.plugin.settings.folderPath + '/' + this.plugin.dataFileName; 
    }

    constructor(private plugin: MoodTrackerPlugin) {
    }

    public async getEntries(): Promise<MoodTrackerEntry[] | undefined> {
        const adapter = this.plugin.app.vault.adapter;
        
        await this.createDataFileIfNotExists();

        try {
            const fileData = await adapter.read(this.filepath);
            if (!fileData) { 
                return new Array<MoodTrackerEntry>(); 
            }
            const data = JSON.parse(fileData) as MoodTrackerEntry[];
            data.forEach(entry => { 
                entry.dateTime = new Date(entry.dateTime); 
                entry.moodRating = Number(entry.moodRating);
            }); // parsing dates
            
            return data;
        } catch (error) {
            this.plugin.showNotice(t("notifications.errorLoadingData"));
            console.warn(error);
        }
    }

    public async saveEntries(): Promise<void> {
        const adapter = this.plugin.app.vault.adapter;

        await this.createDataFileIfNotExists();

        try {
            // override toJSON so dates will be saved with preserved timezone 
            Date.prototype.toJSON = function(){ return window.moment(this).format(); }
            const entries = this.plugin.entries;
            const jsonData = JSON.stringify(entries, null, 2);
            await adapter.write(this.filepath, jsonData);
        } catch (error) {
            this.plugin.showNotice(t("notifications.errorSavingData"));
            console.warn(error);
        }
    }

    private async createDataFileIfNotExists(): Promise<void> {
        const adapter = this.plugin.app.vault.adapter;

        if (!await adapter.exists(this.plugin.settings.folderPath)) {
            this.plugin.showNotice(t("notifications.folderNotFound", { path: this.plugin.settings.folderPath }));
            await adapter.mkdir(this.plugin.settings.folderPath);
            this.plugin.showNotice(t("notifications.folderCreated", { path: this.plugin.settings.folderPath }), 30000);
        }

        if (!await adapter.exists(this.filepath)) {
            this.plugin.showNotice(t("notifications.noDataFile", { path: this.filepath }));
            await adapter.write(this.filepath, "[]");
        }
    }
}