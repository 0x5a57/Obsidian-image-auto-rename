/**
 * 自定义URL编码函数 - 只编码空格
 */
export function onlyEncodeSpace(str: string): string {
    return str.replace(/ /g, '%20');
}

/**
 * 自定义URL编码函数 - 只编码空格和百分号，保留中文
 */
export function safeEncodeURI(str: string): string {
    return str.replace(/[ %]/g, match => {
        switch(match) {
            case ' ': return '%20';
            case '%': return '%25';
            default: return match;
        }
    });
}

/**
 * 自定义URL解码函数
 */
export function safeDecodeURI(str: string): string {
    return decodeURIComponent(str);
}

/**
 * 检查字符串是否已编码
 */
export function isEncoded(str: string): boolean {
    return str !== decodeURIComponent(str);
}