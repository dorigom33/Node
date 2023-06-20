"use strict";

const hello = (req, res) => {
    res.render("home/index");
};

const main = (req, res) => {
    res.redirect("/main");
};

module.exports = {
    hello,
    main
};
