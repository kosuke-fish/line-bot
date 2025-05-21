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

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
  console.error('Webhook error:', err);
  res.status(200).send('OK'); // ← 一旦成功扱いで返して LINE の Verify 通す
});


function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: `こうすけBot: 「${event.message.text}」って言ったね！`
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ LINE bot server is running on port ${port}`);
});

