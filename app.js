var koa = require('koa');
var route = require('koa-route');
var app = module.exports = koa();

var render = require('./lib/render');

function * showHome() {
    this.body = yield render('home');
}


app.use(route.get('/', showHome));
app.listen(3000);
console.log("The app is listening on port 3000");