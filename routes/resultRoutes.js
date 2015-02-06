var db = require('../lib/db');
var render = require('./../lib/render');
var parse = require('co-body');

var helpers = require('../lib/helpers');

module.exports.showResultPage = function * () {
    var questionList = yield db.questions.find({});
    this.body = yield render('result', {questions: questionList});
};

module.exports.renderResultsFile = function * () {
    var postedData = yield parse(this);
    postedData.tags = helpers.splitAndTrimTagString(postedData.tagString);

    var vm = {votes: yield getVotesForCriteria(postedData)};

    this.set('content-type', 'application/vnd.ms-excel');
    this.set('content-disposition', 'attachment;filename=results.xls');

    this.body = yield render('showResults', vm);
};

function * getVotesForCriteria(postedCriteria) {
    var filter = {};
    if (postedCriteria.questionTitle != '') {
        filter.questionTitle = postedCriteria.questionTitle;
    }

    if (postedCriteria.tags.length > 0) {
        filter.tags = {$in: postedCriteria.tags};
    }

    if (postedCriteria.from.length > 0) {
        filter.created_at = {
            $gte: helpers.yyyymmdd_to_date(postedCriteria.from),
            $lte: helpers.yyyymmdd_to_date(postedCriteria.to)
        };
    }
    return yield db.votes.find(filter);
}