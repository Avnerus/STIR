import crypto from 'crypto'

const ALGORITHM = 'aes-256-ctr'
const PASSWORD = process.env.AES_PASSWORD;

export function encryptUser(hook) {
    if (hook.data.phone) {
        hook.data.phone = encrypt(hook.data.phone);
    }
    return hook;
}

export function decryptUser(hook) {
    if (hook.result.phone) {
        hook.result.phone = decrypt(hook.result.phone);
    }
    return hook;
}

export function encrypt(text) {
    console.log("Encrypting " + text);
    const cipher = crypto.createCipher(ALGORITHM, PASSWORD)
    let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    console.log("Encrypted: " + crypted);
    return crypted;
}

export function decrypt(text) {
    console.log("Decrypting " + text);
    const decipher = crypto.createDecipher(ALGORITHM, PASSWORD)
    let dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    console.log("Decrypted " + dec);
    return dec;
}

