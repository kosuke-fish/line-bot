require('dotenv').config(); // ← .env を読み込む

const express = require('express');
const line = require('@line/bot-sdk');
const bodyParser = require('body-parser');

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

const app = express();
app.use(bodyParser.json());

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then(result => res.json(result));
});

const client = new line.Client(config);

const questions = [
  {
    id: 1,
    text: '髪の長さは？',
    options: ['ショート', 'ミディアム', 'ロング']
  },
  {
    id: 2,
    text: '髪色は？',
    options: ['黒', '茶', '金', '派手色']
  }
  // 残り18問も追加できます
];

let userState = {};

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const userId = event.source.userId;

  if (!userState[userId]) {
    userState[userId] = { current: 0, answers: [] };
    return sendQuestion(event.replyToken, userId);
  }

  const state = userState[userId];
  state.answers.push(event.message.text);
  state.current++;

  if (state.current < questions.length) {
    return sendQuestion(event.replyToken, userId);
  } else {
    const summary = state.answers.map((ans, i) => `${questions[i].text} → ${ans}`).join('\n');
    delete userState[userId];
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: `ありがとう！回答内容：\n${summary}`
    });
  }
}

function sendQuestion(replyToken, userId) {
  const q = questions[userState[userId].current];

  return client.replyMessage(replyToken, {
    type: 'template',
    altText: q.text,
    template: {
      type: 'buttons',
      title: `第${q.id}問`,
      text: q.text,
      actions: q.options.map(option => ({
        type: 'message',
        label: option,
        text: option
      }))
    }
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ LINE Bot listening on ${port}`);
});
