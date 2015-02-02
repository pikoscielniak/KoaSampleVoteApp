var render = require('../lib/render');

module.exports.showHome = function * () {
    this.body = yield render('home');
}
