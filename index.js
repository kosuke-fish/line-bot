require('dotenv').config(); // ← .env を読み込む

const express = require('express');
const line = require('@line/bot-sdk');
const bodyParser = require('body-parser');

const app = express();

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

const client = new line.Client(config);

app.use(bodyParser.json());

// 🔽 handleEvent を先に定義する
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: `こうすけBot: 「${event.message.text}」って言ったね！`
  });
}

// 🔽 そのあとで POST ハンドラー
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error('Webhook error:', err);
      res.status(500).end();
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ LINE bot server is running on port ${port}`);
});
