import { TFile } from "obsidian";
import { MoodTrackerEntry } from "src/entities/MoodTrackerEntry";
import MoodTrackerPlugin from "src/main";
import { moment } from "src/services/obsidianMoment";
import { CreateFileModal } from "./createFileModal";

export class FileService {
	constructor(private _plugin: MoodTrackerPlugin) {}

	public async addEntryToJournal(entry: MoodTrackerEntry): Promise<void> {
		if (!this._plugin.settings.journalFilePath) {
			await this.appendToCurrentNote(entry);
			return;
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
		await this.appendEntryToFile(entry, file);
	}

	private replaceVariablesInTemplatedPath(
		templatedPath: string,
		date: Date
	): string {
		// TODO: format from templated path
		const regex = /{{DATE:(.*?)}}/g;
		return templatedPath.replace(regex, (_match, dateFormat) => {
			dateFormat ??= "yyyy-MM-dd";
			return moment(date).format(dateFormat);
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

		if (index != -1 && index != contentArray.length && index+1 != contentArray.length) {
			while ( contentArray[index + 1].startsWith("-") ) {
				index = index + 1;
				if (index == contentArray.length || contentArray[index + 1] == undefined) {
					break;
				}
			}
			contentArray.splice(index + 1, 0, `${result}`);
			await this._plugin.app.vault.modify(file, contentArray.join("\n"));
		} else {
			if ( index+1 != contentArray.length ) {
				this._plugin.showNotice(
					`could not find the selected position in your journal-file -> Adding mood to the bottom.`,
					5000,
					`Mood Tracker`
				);
			}
			const original_content = content.replace(/\n+$/g, "");
			await this._plugin.app.vault.modify(file, original_content + "\n" + result);
		}
		return;
	}

	private getEntryAsString(entry: MoodTrackerEntry): string {
		const templ = this._plugin.settings.entryTemplate;

		return templ
			.replace(/{{TIME(:.*?)?}}/g, (_match, format) => {
				const timeFormat = format ? format.substring(1) : "HH:mm";
				return moment(entry.dateTime).format(timeFormat);
			})
			.replace(/{{DATE(:.*?)?}}/g, (_match, format) => {
				const dateFormat = format ? format.substring(1) : "YYYY-MM-DD";
				return moment(entry.dateTime).format(dateFormat);
			})
			.replace(/{{ICON}}/g, this._plugin.settings.moodRatingLabelDict[entry.moodRating])
			.replace(/{{EMOTIONS}}/g, entry.emotions.join(", "))
			.replace(/{{NOTE}}/g, entry.note)
			.replace(/{{LINEBREAK}}/g, "\n");
	}
}
