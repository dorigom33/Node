"use strict";

const hello = (req, res) => {
    res.render("home/index");
};

const main = (req, res) => {
    // 로그인 사용자 정보가 세션에 없을 경우 로그인 페이지로 리다이렉트
    if (!req.session.userName) {
        return res.redirect('/login');
    }

    res.render("home/main", { userName: req.session.userName });
};

module.exports = {
    hello,
    main
};
