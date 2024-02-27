import { promises as fsPromises } from 'fs';
import { Request, Response } from 'express';
import path from 'path';
import * as paillierBigint from 'paillier-bigint';

export const decrypt = async (req: Request, res: Response) => {
    try {
        const { encNum, name } = req.body;
        const encrypted = BigInt(encNum);

        const priKeyPath = path.join(__dirname, 'data', `${name}-privateKey.json`);
        const pubKeyPath = path.join(__dirname, 'data', `${name}-publicKey.json`);
  
        const privateKeyJson = await fsPromises.readFile(priKeyPath, 'utf8');
        const privateKeyObj = JSON.parse(privateKeyJson);

        const publicKeyJson = await fsPromises.readFile(pubKeyPath, 'utf8');
        const publicKeyObj = JSON.parse(publicKeyJson);

        const publicKey = new paillierBigint.PublicKey(
            BigInt(publicKeyObj.n),
            BigInt(publicKeyObj.g)
        );
        const privateKey = new paillierBigint.PrivateKey(
            BigInt(privateKeyObj.lambda),
            BigInt(privateKeyObj.mu),
            publicKey
        );

        const decrypted = privateKey.decrypt(encrypted);

        res.status(200).json({ decrypted: decrypted.toString() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};