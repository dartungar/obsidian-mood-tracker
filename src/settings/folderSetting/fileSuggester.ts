import { AbstractInputSuggest, App } from "obsidian";

export class GenericTextSuggester extends AbstractInputSuggest<string> {
	constructor(
		app: App,
		private inputEl: HTMLInputElement,
		private items: string[]
	) {
		super(app, inputEl);
	}

	getSuggestions(inputStr: string): string[] {
		const inputLowerCase: string = inputStr.toLowerCase();

		return this.items.filter((item) =>
			item.toLowerCase().includes(inputLowerCase)
		);
	}

	selectSuggestion(item: string, _evt: MouseEvent | KeyboardEvent): void {
		this.setValue(item);
		this.inputEl.trigger("input");
		this.close();
	}

	renderSuggestion(value: string, el: HTMLElement): void {
		if (value) el.setText(value);
	}
}
