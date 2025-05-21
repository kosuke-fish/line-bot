require('dotenv').config(); // ← .env を読み込む

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

// 一時的にLINEミドルウェアを外したWebhookエンドポイント
app.post('/webhook', (req, res) => {
  console.log('✅ Webhook verified');
  res.status(200).send('OK');
});

// ポート設定
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ LINE bot server is running on port ${port}`);
});
