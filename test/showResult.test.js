var app = require('../app.js');
var request = require('supertest').agent(app.listen());
var co = require('co');
require('should');

var testHelpers = require('./testHelpers');
var db = require('./../lib/db');

describe('Showing result', function () {

    var filterPostData = {};

    beforeEach(function (done) {
        filterPostData = {
            questionTitle: '',
            tagString: '',
            from: '',
            to: ''
        };
        testHelpers.removeAllDocs();
        done();
    });

    after(function () {
        testHelpers.removeAllDocs();
    });

    it('has a page to filter results from', function (done) {
        co(function *() {
            yield [
                db.questions.insert({title: 'Question 1?'}),
                db.questions.insert({title: 'Question 2?'}),
                db.questions.insert({title: 'Question 3?'})
            ];
            request
                .get('/results')
                .expect(function (res) {
                    res.text.should.containEql('Question 1?');
                    res.text.should.containEql('Question 2?');
                    res.text.should.containEql('Question 3?');
                })
                .end(done);
        })
    });

    it("filters the results by several tags", function (done) {
        co(function * () {
            yield [
                db.votes.insert({value: 1, tags: ['tag 1'], questionTitle: "Q1"}),
                db.votes.insert({value: 2, tags: ['tag 2'], questionTitle: "Q1"}),
                db.votes.insert({value: 3, tags: ['tag 2', 'tag 1'], questionTitle: "Q1"}),
                db.votes.insert({value: 4, tags: ['tag 3', 'tag 4'], questionTitle: "Q2"})
            ];

            filterPostData.tagString = 'tag 1, tag 2';

            request
                .post('/results')
                .send(filterPostData)
                .expect(function (res) {
                    res.text.should.containEql('<td>1</td>');
                    res.text.should.containEql('<td>2</td>');
                    res.text.should.containEql('<td>3</td>');
                    res.text.should.not.containEql('<td>4</td>');
                    res.text.should.not.containEql('<td>Q2</td>');
                })
                .expect(200)
                .end(done);
        });

    });
});