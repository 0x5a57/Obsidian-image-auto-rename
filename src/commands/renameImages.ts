import { App, MarkdownView, Notice, TFile } from 'obsidian';
import { ImageService } from '../services';

export class RenameImagesCommand {
    constructor(private app: App, private imageService: ImageService) {}

    async execute() {
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (activeView) {
            const file = activeView.file;
            if (file) {
                await this.imageService.updateAllImageNameAndLinksInNote(file, file.path, file.path);
                new Notice('图片重命名完成！');
            }
        } else {
            new Notice('请先打开一个笔记文件！');
        }
    }
}