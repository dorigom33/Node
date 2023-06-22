"use strict";

const express = require("express");
const app = express();
const path = require("path");
const session = require('express-session');
const crypto = require('crypto');
const http = require('http');
const { Server } = require('socket.io');


// 라우팅
const home = require("./src/routes/home");
const auth = require("./src/routes/auth");
const product = require("./src/routes/product");
const auctionRoutes = require("./src/routes/auction");

// 앱 세팅
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const secretKey = crypto.randomBytes(32).toString('hex');
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
}));

// 웹소켓 설정
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // 서버 시간 동기화를 위한 syncTime 이벤트 전송
  socket.emit('syncTime', new Date());
});

// 정적 파일 제공을 위한 미들웨어 설정
app.use(express.static(path.join(__dirname, 'public')));

// 라우트 설정
app.use("/", auctionRoutes);
app.use("/", home);
app.use("/", auth);
app.use("/", product);

module.exports = server; // 'app'이 아닌 'server'를 내보낸다.
