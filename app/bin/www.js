"use strict";

const server = require("../app");
const PORT = 3000;

server.listen(PORT, () =>  {
    console.log(`서버 가동, 포트 번호: ${PORT}`);
});
