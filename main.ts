import { Plugin, TFile} from 'obsidian';
import { initializeServices } from './src/services';
import { initializeCommands } from './src/commands';
import { initializeEvents } from './src/events';

export default class ImageRenamePlugin extends Plugin {
    async onload() {
        // 初始化服务
        const services = initializeServices(this.app);
        
        // 初始化命令
        const commands = initializeCommands(this.app, services.imageService);
        this.addCommand({
            id: 'rename-note-images',
            name: '重命名笔记中的图片',
            icon: 'image-up',
            callback: () => commands.renameImages.execute()
        });

        // 初始化事件处理器
        const eventHandler = initializeEvents(this.app, services.imageService);
        
        // 注册文件创建事件
        this.registerEvent(
            this.app.vault.on('create', (file) => {
                if (file instanceof TFile) {
                    eventHandler.handleFileCreate(file);
                }
            })
        );

        // 注册文件重命名事件
        this.registerEvent(
            this.app.vault.on('rename', (file, oldPath) => {
                if (file instanceof TFile) {
                    eventHandler.handleFileRename(file, oldPath);
                }
            })
        );
    }
}

