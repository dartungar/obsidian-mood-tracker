import { App } from "obsidian";
import { ConfirmationModal } from "src/common/confirmationModal";

export class CreateFileModal extends ConfirmationModal {
	constructor(app: App, path: string, content: string) {
		super(app, "File does not exist", () => this.createFile(path, content));
    this.setContent(`The file at location "${path}" doesn't exist.\nWould you like to create it?`)
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
