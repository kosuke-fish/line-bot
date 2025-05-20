require('dotenv').config(); // ← これを1行目に追加！

const express = require('express');
const line = require('@line/bot-sdk');
const bodyParser = require('body-parser');

const app = express();

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN, // ← 修正済み
  channelSecret: process.env.LINE_CHANNEL_SECRET // ← 修正済み
};
