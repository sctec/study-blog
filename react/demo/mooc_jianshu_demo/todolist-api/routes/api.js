const router = require("koa-router")();
const tools = require("../model/tools.js");
const DB = require("../model/db.js");

router.get("/", async (ctx) => {
  ctx.body = "这是接口";
});

router.get("/list", async (ctx) => {
  try {
    ctx.body = {
      code: 1,
      message: "获取数据成功",
      data: ['red', 'blue', 'yellow'],
    }
  } catch (e) {
    ctx.body = {
      code: 0,
      message: "获取数据失败",
      data: e,
    }
  }
});


module.exports = router.routes();