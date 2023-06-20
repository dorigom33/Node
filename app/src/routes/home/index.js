"use strict";

const express = require('express');
const router = express.Router();

const ctrl = require("./home.ctrl");

router.get('/', ctrl.hello);

router.get('/main', ctrl.main);

module.exports = router;
