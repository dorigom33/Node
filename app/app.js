"use strict";

const express = require("express");
const app = express();
const path = require("path");
const session = require('express-session');
const crypto = require('crypto');

// 라우팅
const home = require("./src/routes/home");
const auth = require("./src/routes/auth");
const product = require("./src/routes/product");
const auctionRoutes = require("./src/routes/auction");

// 앱 세팅
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

// 내장 body-parser 미들웨어 설정
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const secretKey = crypto.randomBytes(32).toString('hex');
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
}));

app.use("/", auctionRoutes);
app.use("/", home);
app.use("/", auth);
app.use("/", product);

module.exports = app;
