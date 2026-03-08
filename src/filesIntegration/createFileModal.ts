import { App } from "obsidian";
import { ConfirmationModal } from "src/common/confirmationModal";
import { t } from "src/i18n";

export class CreateFileModal extends ConfirmationModal {
	constructor(app: App, path: string, content: string) {
		super(app, t("modals.createFile.title"), () => this.createFile(path, content));
    this.setContent(t("modals.createFile.message", { path }))
	}

    async createFile(path: string, content: string): Promise<void> {
        const { vault } = this.app;
    
        const directoryPath = path.substring(0, path.lastIndexOf("/"));

        if (directoryPath != "" && !vault.getFolderByPath(directoryPath)) {
          await vault.createFolder(directoryPath);
        }
    
        await vault.create(path, content);
        this.close();
      }
}
