import { MoodTrackerEntry } from "src/entities/MoodTrackerEntry";
import MoodTrackerPlugin from "src/main";


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
            this.plugin.showNotice(`Error loading mood tracker entries from file ${this.filepath}: ${error}`);
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
            this.plugin.showNotice(`Error saving mood tracker data to file ${this.filepath}: ${error}`);
            console.warn(error);
        }
    }

    private async createDataFileIfNotExists(): Promise<void> {
        const adapter = this.plugin.app.vault.adapter;

        if (!await adapter.exists(this.plugin.settings.folderPath)) {
            this.plugin.showNotice(`Mood Tracker: folder "${this.plugin.settings.folderPath}" not found, creating it...`);
            await adapter.mkdir(this.plugin.settings.folderPath);
            this.plugin.showNotice(`Mood Tracker: created a folder "${this.plugin.settings.folderPath}". You can change the path in the settings; for now you'll have to move mood-tracker-data.json manually. Click to dismiss`, 30000);
        }

        if (!await adapter.exists(this.filepath)) {
            this.plugin.showNotice(`No mood tracker data file found at "${this.filepath}". Creating a new data file...`);
            await adapter.write(this.filepath, "[]");
        }
    }
}