[中文文档](./README_CN.md)

# Obsidian Image Auto-Renaming Plugin

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
2. Add Beta plugin in BRAT settings: `https://github.com/0x5a57/Obsidian-image-rename`
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

If you have any questions or suggestions, please feel free to open an issue on [GitHub Issues](https://github.com/0x5a57/Obsidian-image-rename/issues).

## License

This project is licensed under the WTFPL license.