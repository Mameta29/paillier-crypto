import express from 'express';
import bodyParser from 'body-parser';
import { add } from './add';
import { encrypt } from './encrypt';
import { generateKeyPairs } from './generateKeyPairs';
import { decrypt } from './decrypt';

const app = express();
const port = 3000;

app.use(bodyParser.json());

// エンドポイントをアプリケーションに登録
app.post('/api/add', add);
app.post('/api/encrypt', encrypt);
app.post('/api/generateKeyPairs', generateKeyPairs);
app.post('/api/decrypt', decrypt);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
