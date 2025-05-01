import { Plugin, TFile, Notice} from 'obsidian';
import { initializeServices } from './src/services';
import { isImageFile } from 'src/utils';

export default class ImageRenamePlugin extends Plugin {
    async onload() {
        // 初始化服务
        const services = initializeServices(this.app);
        
        this.addCommand({
            id: 'rename-note-images',
            name: '重命名笔记中的图片',
            icon: 'image-up',
            callback: async () => {
                const activeFile = this.app.workspace.getActiveFile();
                if (!activeFile) {
                    new Notice('请先打开一个笔记文件');
                    return;
                }
                // 调用服务方法，更新笔记中的图片链接和文件名
                await services.imageService.updateAllImageNameAndLinksInNote(this.app, activeFile);
            }
        });
        
        // 注册文件创建事件
        this.registerEvent(
            this.app.vault.on('create', async (file) => {
                if (file instanceof TFile && isImageFile(file)) {
                    await services.imageService.imageFileCreatedRename(this.app,file);
                }
            })
        );

        // 注册文件重命名事件
        this.registerEvent(
            this.app.vault.on('rename', async (file, oldPath) => {
                if (file instanceof TFile && file.extension === 'md') {
                    await services.imageService.updateAllImageNameAndLinksInNote(this.app, file);
                }
            })
        );
    }
}

