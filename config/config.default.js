/* eslint-disable array-bracket-spacing */
/* eslint-disable arrow-parens */
/* eslint-disable quotes */
/* eslint-disable eggache/no-override-exports */
/* eslint-disable eol-last */
/* eslint valid-jsdoc: "off" */

"use strict";

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1640005868187_5596";

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  config.view = {
    mapping: {
      ".ejs": "ejs",
    },
  };
  config.multipart = {
    mode: "file",
    fileExtensions: [".xlsx", ".xls"],
  };
  config.security = {
    csrf: {
      queryName: "_csrf",
      bodyName: "_csrf",
    },
  };
  return {
    ...config,
    ...userConfig,
  };
};
