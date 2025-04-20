import * as crypto from 'crypto';

export function generateHash(fileName: string): string {
    const hashInput = `${fileName}${Date.now()}`
    return crypto.createHash('md5').update(hashInput).digest('hex').slice(0, 12);
}
