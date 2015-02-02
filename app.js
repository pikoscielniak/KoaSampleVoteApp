var koa = require('koa');
var route = require('koa-route');
var serve = require('koa-static');
var app = module.exports = koa();

var homeRoutes = require('./routes/homeRoutes');

app.use(serve(__dirname + "/public"));
app.use(route.get('/', homeRoutes.showHome));

app.listen(3000);
console.log("The app is listening on port 3000");