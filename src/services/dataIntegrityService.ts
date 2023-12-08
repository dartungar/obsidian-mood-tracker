import { MoodTrackerEntry } from "src/entities/MoodTrackerEntry";

export class DataIntegrityService {


    public safeMergeData(entries1: MoodTrackerEntry[], entries2: MoodTrackerEntry[]): MoodTrackerEntry[] {
        const entryMap: Map<string, MoodTrackerEntry> = new Map();

        // Helper function to add entries to the map
        const addEntriesToMap = (entries: MoodTrackerEntry[]) => {
            for (const entry of entries) {
                entryMap.set(entry.id, entry);
            }
        };

        // TODO: advanced conflict resolution, i.e based on new "lastModified" property of entry
    
        // Add entries from both arrays to the map, overriding duplicates
        addEntriesToMap(entries1);
        addEntriesToMap(entries2);
    
        // Create a set from the map's values
        return Array.from(entryMap.values());
    }
}