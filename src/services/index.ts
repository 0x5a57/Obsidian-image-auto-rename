import { App } from 'obsidian';
import { ImageFileCreatedRename, updateAllImageNameAndLinksInNote } from './imageService';

export function initializeServices(app: App) {
    return {
        imageService: {
            imageFileCreatedRename: ImageFileCreatedRename,
            updateAllImageNameAndLinksInNote: updateAllImageNameAndLinksInNote
        }
    };
}

export * from './imageService';