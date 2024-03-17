import jwt, { JwtPayload } from  "jsonwebtoken";

interface TokenValidationResult {
    valid: boolean,
    decoded?: object | string
}

const validateJwt = (token: string): TokenValidationResult => {
    try {
        const secret: string = "FUNAAB_HIGH_SCHOOL"
        const decoded: JwtPayload | string = jwt.verify(token, secret);
        return { valid: true, decoded };
    } catch (error) {
        return { valid: false };
    }
}

export default validateJwt;