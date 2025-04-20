import { App, TFile } from 'obsidian';
import { ImageService } from '../services';
import { isImageFile } from '../utils/file';

export class FileEventHandler {
    constructor(private app: App, private imageService: ImageService) {}

    async handleFileCreate(file: TFile) {
        if (file instanceof TFile && isImageFile(file)) {
            await this.imageService.renameImageFile(file);
        }
    }

    async handleFileRename(file: TFile, oldPath: string) {
        if (file instanceof TFile && file.extension === 'md') {
            await this.imageService.updateAllImageNameAndLinksInNote(file, oldPath, file.path);
        }
    }
}