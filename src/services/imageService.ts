import { App, Notice, TFile, normalizePath } from 'obsidian';
import { generateHash } from '../utils/hash';
import { getAttachmentsFolder } from '../utils/file';

export class ImageService {
    constructor(private app: App) {}

    async updateAllImageNameAndLinksInNote(note: TFile, oldFileName: string, newFileName: string) {
        const content = await this.app.vault.read(note);
        const imageRegex = /!\[.*?\]\((.*)\)/g;
        let imageUrlMatches = [...content.matchAll(imageRegex)];
        
        const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        
        console.log("🖼️ 笔记中的所有图片链接:");
        imageUrlMatches.forEach((match, index) => {
            const imageUrl = match[1];
            const isValidImage = validImageExtensions.some(ext => 
                imageUrl.toLowerCase().endsWith(ext)
            );
            
            if (isValidImage) {
                console.log(`  ${index + 1}. ${imageUrl}`);
            } else {
                console.log(`  ⚠️ ${index + 1}. ${imageUrl} (不支持的图片格式)`);
            }
        });

        let decodedImageLinks: string[] = [];
        imageUrlMatches.forEach(match => {
            const imageUrl = match[1];
            const decodedUrl = decodeURIComponent(imageUrl);
            decodedImageLinks.push(decodedUrl);
        });
        
        let newImageLinks: string[] = [];
        decodedImageLinks.forEach(imageUrl => {
            const extension = imageUrl.split('.').pop() || '';
            const fileName = imageUrl.split('/').pop() || '';
            const hash = generateHash(fileName);
            const newFileName = `${note.basename}_${hash}.${extension}`;
            newImageLinks.push(newFileName);
        });
        
        let updatedContent = await this.app.vault.read(note);
        
        for (let i = 0; i < decodedImageLinks.length; i++) {
            const imageUrl = decodedImageLinks[i];
            const file = this.app.vault.getAbstractFileByPath(imageUrl);
            if (file instanceof TFile) {
                const attachmentsFolder = getAttachmentsFolder(this.app);
                const newPath = normalizePath(`${attachmentsFolder}/${newImageLinks[i]}`);
                const encodedNewPath = newPath.replace(/ /g, '%20');
                
                await this.app.vault.rename(file, newPath);
                
                const originalUrl = imageUrlMatches[i][1];
                updatedContent = updatedContent.replace(originalUrl, encodedNewPath);
                
                console.log(`🔄 图片重命名: ${originalUrl} -> ${encodedNewPath}`);
            }
        }
        
        await this.app.vault.modify(note, updatedContent);
        new Notice('本笔记的所有图片重命名完成');
    }

    async renameImageFile(file: TFile) {
        const attachmentsFolder = getAttachmentsFolder(this.app);
        if (!file.path.startsWith(attachmentsFolder)) {
            return;
        }

        const activeFile = this.app.workspace.getActiveFile();
        if (!activeFile) {
            return;
        }

        const noteName = activeFile.basename;
        const oldFileName = file.name;
        const hash = generateHash(file.name);
        const newFileName = `${noteName}_${hash}.${file.extension}`;
        const newPath = normalizePath(`${attachmentsFolder}/${newFileName}`);

        await this.app.vault.rename(file, newPath);
        await this.updateImageLink(activeFile, oldFileName, newFileName);

        new Notice(`图片链接更新为：${newFileName}`);
    }

    private async updateImageLink(note: TFile, oldFileName: string, newFileName: string) {
        oldFileName = oldFileName.replace(/ /g, '%20');

        let foundMatch = false;
        let attempts = 0;
        let content = await this.app.vault.read(note);

        const start = Date.now();
        while (attempts < 100) {
            if (content.includes(oldFileName)) {
                foundMatch = true;
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 50));
            content = await this.app.vault.read(note);
            attempts++;
        }

        if (foundMatch) {
            const updatedContent = content.replace(oldFileName, newFileName);
            await this.app.vault.modify(note, updatedContent);
        }
    }
}