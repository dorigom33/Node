"use strict";

const express = require("express");
const app = express();
const path = require("path");

// 라우팅
const home = require("./src/routes/home");
const auth = require("./src/routes/auth");

// 앱 세팅
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

// 내장 body-parser 미들웨어 설정
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", home);
app.use("/", auth);

module.exports = app;
