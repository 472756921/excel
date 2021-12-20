/* eslint-disable quotes */
"use strict";

const Controller = require("egg").Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render("index.ejs", {
      data: "world",
      csrf: ctx.csrf,
    });
  }
}

module.exports = HomeController;
