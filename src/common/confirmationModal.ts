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
		const btnsDiv = contentEl.createDiv("mood-tracker-confirmation-actions");
		const okBtn = btnsDiv.createEl("button", { text: "Ok" });
		okBtn.addClass("mood-tracker-confirmation-ok");
		okBtn.tabIndex = 0;
		okBtn.onClickEvent(() => {
			void this.onConfirmCallback().catch((error) => {
				console.error("Mood Tracker confirmation failed", error);
			});
		});
		const cancelBtn = btnsDiv.createEl("button", { text: "Cancel" });
		cancelBtn.tabIndex = 1;
		cancelBtn.onClickEvent(() => {
			if (this.onCancelCallback) {
				void this.onCancelCallback().catch((error) => {
					console.error("Mood Tracker cancellation failed", error);
				});
			}
			this.close();
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
