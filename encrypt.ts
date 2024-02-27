import { Request, Response } from 'express';
import { promises as fsPromises } from 'fs';
import path from 'path';
import * as paillierBigint from 'paillier-bigint';

export const encrypt = async (req: Request, res: Response) => {
    try {
        const { num, name } = req.body;
        console.log("encrypt body", req.body);
        const m = BigInt(num);

        const pubKeyPath = path.join(__dirname, 'data', `${name}-publicKey.json`);
        const publicKeyJson = await fsPromises.readFile(pubKeyPath, 'utf8');
        const publicKeyObj = JSON.parse(publicKeyJson);

        const publicKey = new paillierBigint.PublicKey(
            BigInt(publicKeyObj.n),
            BigInt(publicKeyObj.g)
        );

        const encrypted = publicKey.encrypt(m);

        res.status(200).json({ encrypted: encrypted.toString() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};