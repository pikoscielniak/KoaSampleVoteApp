var app = require('../app.js');
var request = require('supertest').agent(app.listen());
var testHelpers = require('./testHelpers');
var co = require('co');
require('should');

var db = require('./../lib/db');

describe("Adding comment", function () {

    var a_test_vote = {
        tags: ['tag 1', 'tag 2', 'tag 3'],
        voteValue: 3,
        questionId: '0'
    };
    beforeEach(function (done) {
        testHelpers.removeAllDocs();
        done();
    });

    after(function () {
        testHelpers.removeAllDocs();
    });

    it("has a page to add comments", function (done) {

        co(function * () {
            var vote = yield db.votes.insert(a_test_vote);
            request
                .get('/vote/' + vote._id + '/comment')
                .expect('Content-Type', /html/)
                .expect(function (res) {
                    res.text.should.containEql('/vote/' + vote._id + '/comment');
                })
                .expect(200, done);
        });
    });

    it("add vote and redirect to comment page", function (done) {
        co(function * () {
            var vote = yield db.votes.insert(a_test_vote);
            request
                .post('/vote/' + vote._id + '/comment')
                .send({comment: 'A nice little comment'})
                .expect(302)
                .expect('location', '/vote?questionId=' + vote.questionId);
        }).then(done, done);
    });
});