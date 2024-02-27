import { Request, Response } from 'express';
import { promises as fsPromises } from 'fs';
import path from 'path';
import * as paillierBigint from 'paillier-bigint';

export const add = async (req: Request, res: Response) => {
    try {
        const { encNum1, encNum2, name } = req.body;
        const c1 = BigInt(encNum1);
        const c2 = BigInt(encNum2);

        const pubKeyPath = path.join(__dirname, 'data', `${name}-publicKey.json`);
  
        const publicKeyJson = await fsPromises.readFile(pubKeyPath, 'utf8');
        const publicKeyObj = JSON.parse(publicKeyJson);

        const publicKey = new paillierBigint.PublicKey(
            BigInt(publicKeyObj.n),
            BigInt(publicKeyObj.g)
        );

        const encryptedSum = publicKey.addition(c1, c2);

        res.status(200).json({ encryptedSum: encryptedSum.toString() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};