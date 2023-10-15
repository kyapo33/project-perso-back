import * as crypto from 'crypto';

const SECRET_KEY = crypto.scryptSync(process.env.CRYPT_SECRET ?? "", 'salt', 32);
const ALGORITHM = 'aes-256-cbc';

export function encrypt(text: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
    const encryptedText = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

    return iv.toString('hex') + ':' + encryptedText.toString('hex');
}
