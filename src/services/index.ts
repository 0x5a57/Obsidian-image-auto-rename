import { App } from 'obsidian';
import { ImageService } from './imageService';

export function initializeServices(app: App) {
    return {
        imageService: new ImageService(app)
    };
}

export * from './imageService';