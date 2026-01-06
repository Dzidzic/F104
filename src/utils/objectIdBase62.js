const CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function encodeObjectId(objectId) {
    const hex = objectId.toString();
    let num = BigInt("0x" + hex);
    let encoded = "";

    while (num > 0n) {
        encoded = CHARS[num % 62n] + encoded;
        num /= 62n;
    }

    return encoded;
}

function decodeObjectId(encoded) {
    let num = 0n;

    for (const char of encoded) {
        num = num * 62n + BigInt(CHARS.indexOf(char));
    }

    const hex = num.toString(16).padStart(24, "0");
    return hex;
}

module.exports = {
    encodeObjectId,
    decodeObjectId
};