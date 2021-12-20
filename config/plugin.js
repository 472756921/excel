/* eslint-disable eggache/no-override-exports */
/* eslint-disable quotes */
"use strict";

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  ejs: {
    enable: true,
    package: "egg-view-ejs",
  },
};
