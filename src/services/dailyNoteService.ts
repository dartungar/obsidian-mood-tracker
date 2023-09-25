import { Editor, TFile } from "obsidian";
import { MoodTrackerEntry } from "src/entities/MoodTrackerEntry";
import MoodTrackerPlugin from "src/main";


export class DailyNoteService {

/**
 *
 */
    constructor(private _plugin: MoodTrackerPlugin) {
    
    }

    public async appendToCurrentNote(entry: MoodTrackerEntry): Promise<void> {
        // replace in template
        let templ = this._plugin.settings.template;
        let result = templ.replace("{{TIME}}", window.moment(entry.dateTime).format("HH:mm"))
                        .replace("{{ICON}}", this._plugin.settings.moodRatingLabelDict[entry.moodRating])
                        .replace("{{EMOTIONS}}", entry.emotions.join(", "))
                        .replace("{{NOTE}}", entry.note);
        let file = this._plugin.app.workspace.getActiveFile();
        // append to current note
        if (file instanceof TFile) {
            let content = await this._plugin.app.vault.read(file);
            content = content.replace(/\n+$/g, ""); // remove blank lines from the end of file
            this._plugin.app.vault.modify(file, content + "\n" + result);
        }
    }
}