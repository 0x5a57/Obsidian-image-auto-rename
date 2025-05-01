import * as crypto from 'crypto';

export function generateHashedFilename(noteName: string, extension: string): string {
    const hashInput = `${noteName}${Date.now()}${Math.random()}`
    const hash = crypto.createHash('md5').update(hashInput).digest('hex').slice(0, 12);
    return `${noteName}_${hash}.${extension}`;
}