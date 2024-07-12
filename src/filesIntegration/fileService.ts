import { TFile } from "obsidian";
import { MoodTrackerEntry } from "src/entities/MoodTrackerEntry";
import MoodTrackerPlugin from "src/main";
import { CreateFileModal } from "./createFileModal";

export class FileService {
	constructor(private _plugin: MoodTrackerPlugin) {}

	public async addEntryToJournal(entry: MoodTrackerEntry): Promise<void> {
		if (!this._plugin.settings.journalFilePath) {
			await this.appendToCurrentNote(entry);
		}

		const filePath = this.replaceVariablesInTemplatedPath(
			this._plugin.settings.journalFilePath,
			entry.dateTime
		);

		const file = this._plugin.app.vault.getFileByPath(filePath);

		if (file !== null) {
			await this.appendEntryToFile(entry, file);
			return;
		}

		const modal = new CreateFileModal(this._plugin.app,	filePath, this.getEntryAsString(entry)
		);
		modal.open();
	}

	public async appendToCurrentNote(entry: MoodTrackerEntry): Promise<void> {
		const file = this._plugin.app.workspace.getActiveFile();
		this.appendEntryToFile(entry, file);
	}

	private replaceVariablesInTemplatedPath(
		templatedPath: string,
		date: Date
	): string {
		// TODO: format from templated path
		const regex = /{{DATE:(.*?)}}/g;
		return templatedPath.replace(regex, (match, dateFormat) => {
			dateFormat ??= "yyyy-MM-dd";
			return window.moment(date).format(dateFormat);
		});
	}

	private async appendEntryToFile(
		entry: MoodTrackerEntry,
		file: TFile | null
	): Promise<void> {
		if (!(file instanceof TFile)) {
			return;
		}

		const result = this.getEntryAsString(entry);

		const content = await this._plugin.app.vault.read(file);
		const contentArray: string[] = content.split("\n");
		let index: number = contentArray.indexOf(this._plugin.settings.journalPosition);

		if (index != -1 || index == contentArray.length) {
			while ( contentArray[index + 1].startsWith("-") ) {
				index = index + 1;
				if (index = contentArray.length) {
					break;
				}
			}
			contentArray.splice(index + 1, 0, `${result}`);
			this._plugin.app.vault.modify(file, contentArray.join("\n"));
		} else {
			this._plugin.showNotice(
				`could not find the selected position in your journal-file -> Adding mood to the bottom.`,
				5000,
				`Mood Tracker`
			);
			let original_content = content.replace(/\n+$/g, "");
			this._plugin.app.vault.modify(file, original_content + "\n" + result);
		}
		return;
	}

	private getEntryAsString(entry: MoodTrackerEntry): string {
		const templ = this._plugin.settings.entryTemplate;
		return templ
			.replace("{{TIME}}", window.moment(entry.dateTime).format("HH:mm"))
			.replace("{{DATE}}", window.moment(entry.dateTime).format("YYYY-MM-DD"))
			.replace(
				"{{ICON}}",
				this._plugin.settings.moodRatingLabelDict[entry.moodRating]
			)
			.replace("{{EMOTIONS}}", entry.emotions.join(", "))
			.replace("{{NOTE}}", entry.note);
	}
}
