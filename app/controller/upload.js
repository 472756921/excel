/* eslint-disable arrow-parens */
/* eslint-disable array-bracket-spacing */
/* eslint-disable strict */
/* eslint-disable no-undef */
/* eslint-disable quotes */
const Controller = require("egg").Controller;
const fs = require("mz/fs");
const xlsx = require("node-xlsx");
const path = require("path");

module.exports = class extends Controller {
  async upload() {
    const { ctx } = this;
    const file = ctx.request.files[0];
    const obj = xlsx.parse(file.filepath);

    const length = obj[0].data.length - 2;

    const ldata = [];
    for (let i = 2; i <= length; i++) {
      const ordata = obj[0].data[i];
      const data = [
        ordata[7],
        ordata[10],
        ordata[9],
        ordata[6] + ordata[5],
        ordata[25],
        ordata[28],
        ordata[26],
        ordata[21],
        ordata[24],
        ordata[23],
        0,
        ordata[23],
        ordata[19],
        ordata[11],
        "正常",
      ];
      ldata.push(data);
    }

    const wdata = [
      {
        name: "sheet1",
        data: [
          [
            "卡号",
            "车牌",
            "持卡人",
            "时间",
            "产品",
            "单价",
            "数量",
            "应付金额",
            "消费折扣",
            "实付金额",
            "优惠分摊",
            "可开票金额",
            "油站",
            "卡片备注",
            "状态",
          ],
          ...ldata,
        ],
      },
    ];

    fs.writeFileSync("./data.xlsx", xlsx.build(wdata), "binary");
    const filename = `data.xlsx`;
    const filePath = path.resolve(this.app.config.baseDir, filename);

    ctx.attachment("data.xlsx");
    ctx.body = fs.createReadStream(filePath);
    fs.unlink(filePath, (err) => {
      if (err) throw err;
    });
  }
};
