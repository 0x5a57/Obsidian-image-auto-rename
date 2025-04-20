import * as crypto from 'crypto';

export function generateHash(input: string): string {
    return crypto.createHash('md5').update(input).digest('hex').slice(0, 12);
}
