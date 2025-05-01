import { App, Notice, TFile, normalizePath } from 'obsidian';
import { generateHashedFilename } from '../utils/hash';

export async function ImageFileCreatedRename(app: App, ImageFile: TFile) {
    const activeFile = app.workspace.getActiveFile();
    if (!activeFile) {
        return;
    }

    const noteName = activeFile.basename;
    const oldImageFileName = ImageFile.name;
    const newImageFileName = generateHashedFilename(noteName, ImageFile.extension);
    console.log(`🖼️ 图片重命名: ${oldImageFileName} -> ${newImageFileName}`);

    // 检测笔记内容，图片文件创建后，需要一定时间才会更新内容，然后搜索到到图片链接
    let cache = app.metadataCache.getFileCache(activeFile);
    // 以50ms为间隔检测100次
    let foundMatch = false;
    let attempts = 0;
    while (attempts < 100) {
        if (cache?.embeds) {
            // 遍历所有嵌入链接
            for (const embed of cache.embeds) {
                // 检查链接是否包含当前图片文件名
                if (embed.link.includes(oldImageFileName)) {
                    foundMatch = true;
                    break;
                }
            }
        }
        if (foundMatch) break;
        await new Promise(resolve => setTimeout(resolve, 50));
        cache = app.metadataCache.getFileCache(activeFile);
        attempts++;
    }
    console.log(`⏱️ 检测图片链接耗时: ${attempts * 50}ms`);
    console.log(cache?.embeds);

    if (!foundMatch) {
        new Notice('图片链接未在笔记中找到');
        return;
    }

    // 替换imageFile.path中的文件名部分
    const newPath = normalizePath(ImageFile.path.replace(oldImageFileName, newImageFileName));
    await app.fileManager.renameFile(ImageFile, newPath);
    new Notice(`图片链接更新为：${newImageFileName}`);
}

export async function updateAllImageNameAndLinksInNote(app: App, note: TFile) {
    const validImageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const cache = app.metadataCache.getFileCache(note);
    const noteName = note.basename;
    
    // 1、获取所有的嵌入链接，筛选出validImageExtensions类型的图片链接
    // 2、去重
    const imageEmbeds = cache?.embeds?.filter(embed => {
        const extension = embed.link.split('.').pop()?.toLowerCase() || '';
        return validImageExtensions.includes(extension);
    }) || [];
    const uniqueImageLinks = [...new Set(imageEmbeds.map(embed => embed.link))];
    if (uniqueImageLinks.length === 0) {
        return;
    }
    // 3、遍历所有的嵌入链接，对图片重命名，触发Obsidian的自动更新笔记链接
    for (const link of uniqueImageLinks) {
        const imageFile = app.metadataCache.getFirstLinkpathDest(link, note.path);
        if (imageFile) {
            console.log(`🖼️ 图片存在: ${imageFile.name}`);
            const newImageFileName = generateHashedFilename(noteName, imageFile.extension);
            console.log(`🖼️ 图片重命名: ${imageFile.name} -> ${newImageFileName}`);
            // 替换imageFile.path中的文件名部分
            const newPath = normalizePath(imageFile.path.replace(imageFile.name, newImageFileName));
            await app.fileManager.renameFile(imageFile, newPath);
        }else{
            console.log(`🖼️ 图片不存在: ${link}`);
            continue;
        }
    }
    // new Notice('本笔记的所有图片重命名完成');
}

