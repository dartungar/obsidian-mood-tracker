import { TFile } from "obsidian";
import { MoodTrackerEntry } from "src/entities/MoodTrackerEntry";
import MoodTrackerPlugin from "src/main";

export class NoteService {
	constructor(private _plugin: MoodTrackerPlugin) {}

	public async appendToCurrentNote(entry: MoodTrackerEntry): Promise<void> {
		const file = this._plugin.app.workspace.getActiveFile();
		this.appendEntryToFile(entry, file);
	}

	public async appendEntryToFile(
		entry: MoodTrackerEntry,
		file: TFile | null
	): Promise<void> {
		if (!(file instanceof TFile)) {
			return;
		}

		const templ = this._plugin.settings.template;
		const result = templ
			.replace("{{TIME}}", window.moment(entry.dateTime).format("HH:mm"))
			.replace(
				"{{ICON}}",
				this._plugin.settings.moodRatingLabelDict[entry.moodRating]
			)
			.replace("{{EMOTIONS}}", entry.emotions.join(", "))
			.replace("{{NOTE}}", entry.note);

		let content = await this._plugin.app.vault.read(file);
		// TODO: add in specific place, e.g after specified heading
		content = content.replace(/\n+$/g, "");
		this._plugin.app.vault.modify(file, content + "\n" + result);
	}
}
