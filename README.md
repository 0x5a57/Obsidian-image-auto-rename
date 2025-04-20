# Obsidian 图片自动重命名插件/Obsidian Image Auto-Renaming Plugin

<div align="center">
  <a href="#english">English</a> | 
  <a href="#中文">中文</a>
</div>


## <span id="english">English</span>
This is a plugin for Obsidian that automatically renames image files pasted or dragged into notes, making image filenames more organized and easier to manage.

## Features

- **Auto Renaming**: Automatically renames images pasted into notes to "NoteName_HashValue.Extension" format
- **Batch Processing**: Supports batch renaming of existing images in notes
- **Real-time Monitoring**: Listens to file creation and rename events, automatically processes newly added images
- **Smart Link Update**: Automatically updates image links in notes while renaming images

## Naming Rules

When pasting images, they will be renamed to `NoteName_HashValue.Extension` format.
Hash value calculation method:
- Uses MD5 algorithm to hash "original filename + current timestamp"
- Takes the first 12 characters of the hash result as part of the filename
- This ensures filename uniqueness while maintaining reasonable length

## Usage

1. Install the plugin in Obsidian
2. Directly paste images into notes, the plugin will automatically handle renaming
3. Use the "Rename Images in Note" command in the command palette to batch process all images in the current note

## Installation

### Via BRAT (Recommended)

1. Install [Obsidian BRAT](https://github.com/TfTHacker/obsidian42-brat) plugin
2. Add Beta plugin in BRAT settings: `https://github.com/0x5a57/Obsidian-image-auto-rename`
3. Enable "Image Auto-Renaming" plugin in community plugins list

## FAQ

- **Q: What image formats does the plugin support?**
  A: Supports common image formats like jpg, jpeg, png, gif, webp, svg.

- **Q: Will renaming images affect references in notes?**
  A: No, the plugin will automatically update image links in notes.

## Future Plans
- [ ] Support customizing which image formats to process
- [ ] Support custom naming rules
- [ ] Support custom naming prefixes

## Feedback & Support

If you have any questions or suggestions, please feel free to open an issue on [GitHub Issues](https://github.com/0x5a57/Obsidian-image-auto-rename/issues).

## License

This project is licensed under the WTFPL license.

## <span id="中文">中文</span>
这是一个为 Obsidian 开发的插件，可以自动重命名粘贴或拖拽到笔记中的图片文件，使图片文件名更有规律，便于管理。

## 功能特点

- **自动重命名**：将粘贴到笔记中的图片自动重命名为"笔记名_哈希值.扩展名"格式
- **批量处理**：支持对笔记中已有的图片进行批量重命名
- **实时监控**：监听文件创建和重命名事件，自动处理新添加的图片
- **智能链接更新**：重命名图片的同时，自动更新笔记中的图片链接

## 命名规则

在粘贴图片时，会将图片重命名为 `笔记名_哈希值.扩展名` 格式。
哈希值的计算方法为：
- 使用 MD5 算法对"原文件名+当前时间戳"进行哈希计算
- 取哈希结果的前12位作为文件名的一部分
- 这种方式可以确保文件名的唯一性，同时保持合理的长度

## 使用方法

1. 在 Obsidian 中安装插件
2. 直接将图片粘贴到笔记中，插件会自动处理重命名
3. 使用命令面板中的"重命名笔记中的图片"命令可以批量处理当前笔记中的所有图片

## 安装方法

### 通过 BRAT 安装（推荐）

1. 安装 [Obsidian BRAT](https://github.com/TfTHacker/obsidian42-brat) 插件
2. 在 BRAT 设置中添加 Beta 插件：`https://github.com/0x5a57/Obsidian-image-auto-rename`
3. 在社区插件列表中启用"图片自动重命名"插件

## 常见问题

- **Q: 插件会处理哪些类型的图片？**
  A: 支持 jpg、jpeg、png、gif、webp、svg 等常见图片格式。

- **Q: 图片重命名后会影响笔记中的引用吗？**
  A: 不会，插件会自动更新笔记中的图片链接。

## 未来计划
- [ ] 支持自定义哪些图片格式
- [ ] 支持自定义命名规则
- [ ] 支持自定义命名前缀

## 反馈与支持

如果你有任何问题或建议，欢迎在 [GitHub Issues](https://github.com/0x5a57/Obsidian-image-auto-rename/issues) 中提出。

## 许可证

本项目采用 WTFPL 许可证。