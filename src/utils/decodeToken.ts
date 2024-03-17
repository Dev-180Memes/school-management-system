import { Buffer } from 'buffer';

const decodeJWT = (token: string): Record<string, unknown> | null => {
    try {
        const base64Url = token.split(".")[1];
        if (!base64Url) {
            throw new Error(" Invalid JWT: Missing payload");
        }

        const base64 = base64Url.replace("-", "+").replace("_", "/");

        const jsonpayload = Buffer.from(base64, "base64").toString("utf-8");
        const payload = JSON.parse(jsonpayload);
        
        return payload;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default decodeJWT;