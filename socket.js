const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('A user connected');
});

module.exports = io;

// curl -I https://live-aninight.ani-night.online/live/aninight/index.m3u8

// sudo nginx -t
// sudo systemctl restart nginx

// # รีสตาร์ทเซิร์ฟเวอร์ Node.js
// node app.js
// sudo nano /etc/nginx/conf.d/default.conf
