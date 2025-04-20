import { App } from 'obsidian';
import { FileEventHandler } from './fileEvents';
import { ImageService } from '../services';

export function initializeEvents(app: App, imageService: ImageService) {
    return new FileEventHandler(app, imageService);
}

export * from './fileEvents';