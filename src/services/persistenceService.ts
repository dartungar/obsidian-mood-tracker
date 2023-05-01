import { MoodTrackerEntry } from "src/entities/MoodTrackerEntry";
import MoodTrackerPlugin from "src/main";
import fs from "fs/promises";


export class PersistenceService {
    private get filepath(): string { 
        return this.plugin.settings.folderPath + '/' + this.plugin.dataFileName; 
    }

    constructor(private plugin: MoodTrackerPlugin) {
    }

    public async getEntries(): Promise<MoodTrackerEntry[] | undefined> {
        let adapter = this.plugin.app.vault.adapter;
        
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
        let adapter = this.plugin.app.vault.adapter;

        await this.createDataFileIfNotExists();

        try {
            const entries = this.plugin.entries;
            const jsonData = JSON.stringify(entries, null, 2);
            await adapter.write(this.filepath, jsonData);
        } catch (error) {
            this.plugin.showNotice(`Error saving mood tracker data to file ${this.filepath}: ${error}`);
            console.warn(error);
        }
    }

    private async createDataFileIfNotExists(): Promise<void> {
        let adapter = this.plugin.app.vault.adapter;

        if (!await adapter.exists(this.filepath)) {
            this.plugin.showNotice(`No mood tracker data file found at ${this.filepath}. Creating a new one...`);
            await adapter.write(this.filepath, "[]");
        }
    }
}