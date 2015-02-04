var app = require('../app.js');
var request = require('supertest').agent(app.listen());
var testHelpers = require('./testHelpers');
var co = require('co');
require('should');

var db = require('./../lib/db');

describe("Updating questions", function () {

    beforeEach(function (done) {
        testHelpers.removeAllDocs();
        done();
    });

    after(function () {
        testHelpers.removeAllDocs();
    });

    it("shows a nice page fo rexisting questions", function (done) {

        co(function * () {
            var q = yield db.questions.insert({
                title: 'A question?',
                tags: ['tag1', 'tag2']
            });
            request
                .get('/question/' + q._id)
                .expect('Content-Type', /html/)
                .expect(function (res) {
                    res.text.should.containEql(q.title);
                    res.text.should.containEql('tag1, tag2');
                })
                .expect(200, done);
        });


    });
    it("updates an existing question", function (done) {
        co(function * () {
            var q = yield db.questions.insert({
                title: 'A question?',
                tags: ['tag1', 'tag2']
            });
            request
                .post('/question/' + q._id)
                .send({
                    questionTitle: "An updated question",
                    tagString: 'tag3, tag4'
                })
                .expect('location', '/question/' + q._id)
                .expect(302);
        }).then(done, done);
    });
});