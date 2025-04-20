import { App } from 'obsidian';
import { RenameImagesCommand } from './renameImages';
import { ImageService } from '../services';

export function initializeCommands(app: App, imageService: ImageService) {
    return {
        renameImages: new RenameImagesCommand(app, imageService)
    };
}

export * from './renameImages';