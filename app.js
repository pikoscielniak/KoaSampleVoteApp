var koa = require('koa');
var route = require('koa-route');
var serve = require('koa-static');
var app = module.exports = koa();

var homeRoutes = require('./routes/homeRoutes');
var questionRoutes = require('./routes/questionRoutes');
var voteRoutes = require('./routes/voteRoutes');
var resultRoutes = require('./routes/resultRoutes');

app.use(serve(__dirname + "/public"));

//home
app.use(route.get('/', homeRoutes.showHome));

//question
app.use(route.get('/question', questionRoutes.showNewQuestion));
app.use(route.post('/question', questionRoutes.addQuestion));
app.use(route.get('/question/:id', questionRoutes.showQuestion));
app.use(route.post('/question/:id', questionRoutes.updateQuestion));
app.use(route.get('/vote', voteRoutes.showAddVote));
app.use(route.post('/vote', voteRoutes.addVote));
app.use(route.get('/vote/:id/comment', voteRoutes.showAddComment));
app.use(route.post('/vote/:id/comment', voteRoutes.addComment));
app.use(route.get('/results', resultRoutes.showResultPage));
app.use(route.post('/results', resultRoutes.renderResultsFile));


app.listen(3000);
console.log("The app is listening on port 3000");