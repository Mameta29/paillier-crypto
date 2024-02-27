// TypeScriptのインポート文を使用
import { Request, Response } from 'express';
import { promises as fsPromises } from 'fs';
import path from 'path';
import * as paillierBigint from 'paillier-bigint';

function bigintToJson(key: any): string {
    return JSON.stringify(key, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    );
}

export const generateKeyPairs = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        // 鍵長を指定
        const keyLength = Number(process.env.KEY_LENGTH) || 1024;
        console.log('Key Length:', keyLength);

        if (!name) {
            return res.status(400).json({ error: 'Bad Request. Please provide your name!' });
        }

        // Paillierキーペアを生成
        const { publicKey, privateKey } = await paillierBigint.generateRandomKeys(keyLength);

        // ファイルパスを定義
        const pubKeyPath = path.join(__dirname, 'data', `${name}-publicKey.json`);
        const priKeyPath = path.join(__dirname, 'data', `${name}-privateKey.json`);

        // キーをJSON形式でファイルに非同期で書き込む
        await fsPromises.writeFile(pubKeyPath, bigintToJson(publicKey), 'utf8');
        await fsPromises.writeFile(priKeyPath, bigintToJson(privateKey), 'utf8');

        res.status(200).json({
            message: "Keys were generated and saved successfully.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};