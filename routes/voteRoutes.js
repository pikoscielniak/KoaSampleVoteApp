var render = require('./../lib/render');
var db = require('./../lib/db');

function exists(value) {
    return !!value;
}

module.exports.showAddVote = function * () {
    var questionId = this.query.questionId;

    if (!exists(questionId)) {
        this.set('ErrorMessage', "No questionId passed to page");
        this.redirect('/');
        return;
    }

    var question = yield db.questions.findById(questionId);

    if (!exists(question)) {
        this.set('ErrorMessage', "No question found for id: " + questionId);
        this.redirect('/');
        return;
    }

    var vm = {
        tagString: question.tags.join(','),
        questionTitle: question.title,
        questionId: questionId
    };
    this.body = yield render('newVote', vm);
};