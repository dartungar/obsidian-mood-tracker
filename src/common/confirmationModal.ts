import { App, Modal } from "obsidian";

export abstract class ConfirmationModal extends Modal {
	constructor(
		app: App,
		private title: string,
		private onConfirmCallback: () => Promise<void>,
		private onCancelCallback?: () => Promise<void>
	) {
		super(app);
		
	}

	onOpen() {
		const { contentEl } = this;
		this.titleEl.setText(this.title);
		const btnsDiv = contentEl.createDiv();
		btnsDiv.style.marginTop = "10px"
		const okBtn = btnsDiv.createEl("button", { text: "Ok" });
		okBtn.style.marginRight = "0.5rem";
		okBtn.tabIndex = 0;
		okBtn.onClickEvent(async () => await this.onConfirmCallback());
		const cancelBtn = btnsDiv.createEl("button", { text: "Cancel" });
		cancelBtn.tabIndex = 1;
		cancelBtn.onClickEvent(() => {
			if (this.onCancelCallback) {
				this.onCancelCallback();
			}
			this.close();
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
