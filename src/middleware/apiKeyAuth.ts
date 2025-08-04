import prisma from '../utils/prisma';
import http from 'http';

export const validateApiKey = async (req: http.IncomingMessage): Promise<boolean> => {
    const rawKey = req.headers['x-api-key'];
    const key = Array.isArray(rawKey) ? rawKey[0] : rawKey;

    if (!key || typeof key !== 'string'){
        return false;
    }
    // local testing apiKey
    if (key === process.env.API_KEY) {
        return true;
    }
    // future implementation - check the db for the apiKey and use bcrypt for encryption
     const exists = await prisma.apiKey.findUnique({ where: { key } });{
        return !!exists;
    }
};
