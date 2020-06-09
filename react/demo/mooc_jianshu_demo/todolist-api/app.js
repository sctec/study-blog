const koa = require("koa");
const router = require("koa-router")();
const path = require("path");
const bodyParser = require("koa-bodyparser");
const jsonp = require("koa-jsonp");
const cors = require("koa2-cors");

const app = new koa();
//配置post提交数据的中间件
app.use(bodyParser());
app.use(jsonp());
app.use(cors());
//
const api = require("./routes/api.js");

router.use("/api", api);

app.use(router.routes());
app.use(router.allowedMethods);
app.listen(3001, () => {
  console.log("服务器已启动");
});