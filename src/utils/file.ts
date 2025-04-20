import { App, TFile, normalizePath} from 'obsidian';

export function isImageFile(file: TFile): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    return imageExtensions.includes(file.extension.toLowerCase());
}

export function getAttachmentsFolder(app: App): string {
    // 获取配置的附件文件夹路径，如果没有配置则使用默认路径
    const attachmentsFolder = (app.vault as any).getConfig('attachmentFolderPath') || 'attachments';
    return normalizePath(attachmentsFolder);
}
