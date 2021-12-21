/* eslint-disable indent */
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
		const ldataObj = {};
		const date = ["0", "0"];
		let publicInfo = { acccode: "0", accname: "0", cname: "0" };
		if (obj[0].data[2]) {
			publicInfo = {
				acccode: obj[0].data[2][12],
				accname: obj[0].data[2][13],
				cname: obj[0].data[2][13],
			};
		}

		for (let i = 2; i <= length; i++) {
			const ordata = obj[0].data[i];
			date[0] = ordata[6] + " " + ordata[5];
			if (ordata[6] + ordata[5] > date[1]) {
				date[1] = ordata[6] + " " + ordata[5];
			}
			if (ordata[6] + ordata[5] < date[0]) {
				date[0] = ordata[6] + " " + ordata[5];
			}
			const data = [ordata[7], ordata[10], ordata[9], ordata[6] + " " + ordata[5], ordata[25], ordata[28], ordata[26], ordata[21], ordata[24], ordata[23], 0, ordata[23], ordata[19], ordata[11], "正常"];
			if (ldataObj[ordata[7]]) {
				ldataObj[ordata[7]].push(data);
			} else {
				ldataObj[ordata[7]] = [data];
			}
		}

		const ordata2Info = { kaipiao: 0, yingfu: 0, xiaofeizhekou: 0, shifu: 0 };
		Object.keys(ldataObj).map((it) => {
			const c = getCount(ldataObj[it]);
			ldataObj[it].push(c);
			ldata.push(...ldataObj[it]);
		});

		function getCount(mt) {
			const numb = [0, 0, 0, 0, 0, 0];
			mt.map((it) => {
				numb[0] += Number(it[6]);
				numb[1] += Number(it[7]);
				numb[2] += Number(it[8]);
				numb[3] += Number(it[9]);
				numb[4] += Number(it[10]);
				numb[5] += Number(it[11]);
				return "";
			});
			const count = [`合计: ${mt[0][0]}`, "", "", "", "", "", numb[0], numb[1], numb[2], numb[3], numb[4], numb[5]];
			ordata2Info.kaipiao += numb[5];
			ordata2Info.yingfu += numb[1];
			ordata2Info.xiaofeizhekou += numb[2];
			ordata2Info.shifu += numb[3];
			return count;
		}

		const ordata1 = [
			["账户编号", publicInfo.acccode, "", "", "", "", "", "", "", "", "账单日期", `${date[0]} - ${date[1]}`],
			["账户名称", publicInfo.accname, "", "", "", "", "", "", "", "", "公司名称", publicInfo.cname],
		];
		const ordata2 = [["客户总账"], ["期初余额", "本期充值实付", "本期充值优惠", "本期返利金额", "本期费用", "本期退款", "本期账户调整", "本期消费应付", "本期消费折扣", "本期消费实付", "期末余额", "本期优惠分摊金额", "本期可开票金额"], ["1", "2", "3", "4", "5", "6", "7", ordata2Info.yingfu, ordata2Info.xiaofeizhekou, ordata2Info.shifu, "11", "12", ordata2Info.kaipiao]];
		const ordata3 = [["充值明细"], ["序号", "充值日期", "付款类型", "充值渠道", "地点", "充值对象", "实付金额", "充值优惠", "状态"], ["1", "2", "3", "4", "5", "6", "7", "8", "9"]];
		const ordata4 = [["返利明细"], ["序号", "时间", "返利周期名称", "返利金额"], ["1", "2", "3", "4"]];
		const ordata5 = [["退款、账户调整明细"], ["序号", "时间", "类型", "金额", "备注"], ["1", "2", "3", "4", "5"]];
		const ordata6 = [["费用明细"], ["序号", "时间", "费用名称", "数量", "费用额"], ["1", "2", "3", "4", "5"]];
		const main = [["消费明细"], ["卡号", "车牌", "持卡人", "时间", "产品", "单价", "数量", "应付金额", "消费折扣", "实付金额", "优惠分摊", "可开票金额", "油站", "卡片备注", "状态"]];
		const wdata = [
			{
				name: "sheet1",
				data: [["", "", "", "", "", "客户对账单"], [], ...ordata1, [], ...ordata2, [], ...ordata3, [], ...main, ...ldata, [], ...ordata4, [], ...ordata5, [], ...ordata6, []],
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
