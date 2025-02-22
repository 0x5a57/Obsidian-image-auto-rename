import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, normalizePath} from 'obsidian';
import * as crypto from 'crypto';



export default class MyPlugin extends Plugin {

	async onload() {
		// 添加重命名图片的命令
		this.addCommand({
			id: 'rename-note-images',
			name: '重命名笔记中的图片',
			icon: 'image-plus',  // 使用 Lucide 图标
			callback: async () => {
				const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (activeView) {
					const file = activeView.file;
					if (file) {
						await this.updateAllImageNameAndLinksInNote(file, file.path, file.path);
						new Notice('图片重命名完成！');
					}
				} else {
					new Notice('请先打开一个笔记文件！');
				}
			}
		});

		// 监听文件创建事件
        this.registerEvent(
            this.app.vault.on('create', (file) => {
                if (file instanceof TFile && this.isImageFile(file)) {
                    this.renameImageFile(file);
                }
            })
        );

		// 监听文件重命名事件
		this.registerEvent(
			this.app.vault.on('rename', (file, oldPath) => {
				// 检测文件为md后缀
				if (file instanceof TFile && file.extension === 'md') {
					this.updateAllImageNameAndLinksInNote(file,oldPath,file.path);
				}
			})
		);
	}

	// 更新笔记中的所有图片链接
	async updateAllImageNameAndLinksInNote(note: TFile, oldFileName: string, newFileName: string) {
		// 获取笔记内容
		const content = await this.app.vault.read(note);
		// 使用正则表达式匹配Markdown图片链接
		const imageRegex = /!\[.*?\]\((.*)\)/g;
		// 匹配到的所有图片链接
		let imageUrlMatches = [...content.matchAll(imageRegex)];
		
		// 定义支持的图片格式
		const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
		
		// 打印找到的所有图片链接
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
		// 将链接中的 %20 转换为空格
		let decodedImageLinks: string[] = [];
		imageUrlMatches.forEach(match => {
			const imageUrl = match[1];
			const decodedUrl = decodeURIComponent(imageUrl);
			decodedImageLinks.push(decodedUrl);
		});
		console.log("🔥decodedImageLinks：",decodedImageLinks)
		
		// 构造图片的新文件名
		let newImageLinks: string[] = [];
		decodedImageLinks.forEach(imageUrl => {
			// 获取文件扩展名
			const extension = imageUrl.split('.').pop() || '';
			// 从imageUrl中提取文件名
			const fileName = imageUrl.split('/').pop() || '';
			// 生成新的哈希值
			const hash = this.generateHash(fileName + Date.now());
			// 构造新的文件名，使用新笔记名
			const newFileName = `${note.basename}_${hash}.${extension}`;
			newImageLinks.push(newFileName);
		});
		
		console.log("🔥构造的新图片文件名：", newImageLinks);

		
		// 将附件文件夹中的图片链接重命名
		let updatedContent = await this.app.vault.read(note);
		
		for (let i = 0; i < decodedImageLinks.length; i++) {
			const imageUrl = decodedImageLinks[i];
			const file = this.app.vault.getAbstractFileByPath(imageUrl);
			if (file instanceof TFile) {
				const attachmentsFolder = this.getAttachmentsFolder();
				// 将新路径中的空格转换为 %20
				const newPath = normalizePath(`${attachmentsFolder}/${newImageLinks[i]}`);
				const encodedNewPath = newPath.replace(/ /g, '%20');
				
				// 重命名真实的图片文件，使用 app.vault.rename api
				await this.app.vault.rename(file, newPath);
				
				// 使用原始的 imageUrlMatches 中的链接进行替换
				const originalUrl = imageUrlMatches[i][1];  // 获取原始链接
				updatedContent = updatedContent.replace(originalUrl, encodedNewPath);
				
				console.log(`🔄 图片重命名: ${originalUrl} -> ${encodedNewPath}`);
			}
		}
		
		// 所有替换完成后，一次性更新笔记内容
		await this.app.vault.modify(note, updatedContent);
	}

	
	// 检查文件是否是图片
    isImageFile(file: TFile): boolean {
        const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'];
        return imageExtensions.includes(file.extension);
    }

	// 重命名图片文件
    async renameImageFile(file: TFile) {
        const attachmentsFolder = this.getAttachmentsFolder();
		// 添加打印语句，加入emoji更好看，查看attachmentsFolder的值
		console.log("🔥attachmentsFolder：",attachmentsFolder)
        if (!file.path.startsWith(attachmentsFolder)) {
            return; // 如果文件不在 attachments 文件夹中，不处理
        }
		console.log("🔥file：",file)

        const activeFile = this.app.workspace.getActiveFile();
        if (!activeFile) {
            return; // 如果没有打开的笔记，不处理
        }
		console.log("🔥笔记的activeFile：",activeFile)

        const noteName = activeFile.basename; // 获取当前笔记的名字
		const oldFileName = file.name; // 获取当前文件的名字
		console.log("🔥文件的旧名字：",oldFileName)
		console.log("🔥笔记的名字：",noteName)

        const hash = this.generateHash(file.name + Date.now()); // 生成哈希值
        const newFileName = `${noteName}_${hash}.${file.extension}`; // 新文件名
		console.log("🔥newFileName：",newFileName)
        const newPath = normalizePath(`${attachmentsFolder}/${newFileName}`); // 新路径

        // 重命名文件
        await this.app.vault.rename(file, newPath);
		console.log("🔥newPath：",newPath)

		// 更新笔记里面的图片链接
		await this.updateImageLink(activeFile, oldFileName, newFileName);

		// 显示提示信息
		new Notice(`图片链接更新为：${newFileName}`);
    }

    // 获取 attachments 文件夹路径
    getAttachmentsFolder(): string {
        // 使用 app.vault.getConfig 获取附件文件夹路径
        const attachmentsFolder = (this.app.vault as any).getConfig('attachmentFolderPath') || 'attachments';
        return normalizePath(attachmentsFolder);
    }

    // 生成 8 位哈希值
    generateHash(input: string): string {
        return crypto.createHash('md5').update(input).digest('hex').slice(0, 8);
    }

	async updateImageLink(note: TFile, oldFileName: string, newFileName: string) {
		console.log(`🔍 开始更新笔记 (${note.path})，旧文件名: ${oldFileName}, 新文件名: ${newFileName}`);
	
		oldFileName = oldFileName.replace(/ /g, '%20');

		let foundMatch = false;
		let attempts = 0;
		let content = await this.app.vault.read(note);
		console.log("📄 读取笔记内容:\n", content);
	
		// 测试用时
		const start = Date.now();
		// 每 50 ms 检查一次，最多 100 次
		while (attempts < 100) {
			if (content.includes(oldFileName)) {
				foundMatch = true;
				//打印结束时间，格式化为秒
				const end = Date.now();
				console.log(`🕒 更新笔记链接用时: ${(end - start) / 1000} 秒`);
				break;
			}
			console.log(`⏳ 等待图片链接生成... 尝试 ${attempts + 1}`);
			await new Promise(resolve => setTimeout(resolve, 50));  // 延时 50 毫秒
			content = await this.app.vault.read(note);
			attempts++;
			console.log("📄 读取笔记内容:\n", content);
		}
	
		if (foundMatch) {
			console.log("✏️ 更新 Markdown 中的图片链接...");
			const updatedContent = content.replace(oldFileName, newFileName);
			await this.app.vault.modify(note, updatedContent);
			console.log("✅ 图片引用更新完成");
		} else {
			console.log("❌ 图片链接未生成，跳过更新");
		}
	}

}

