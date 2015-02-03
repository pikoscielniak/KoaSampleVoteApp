var app = require('../app.js');
var request = require('supertest').agent(app.listen());
var co = require('co');
require('should');

var testHelpers = require('./testHelpers');
var db = require('./../lib/db');

describe('The homepage', function () {

    beforeEach(function (done) {
        testHelpers.removeAllDocs();
        done();
    });

    after(function () {
        testHelpers.removeAllDocs();
    });

    it('displays nicely without errors', function (done) {
        request
            .get('/')
            .expect(200)
            .expect('Content-Type', /html/)
            .end(done);
    });

    it("lists all the questions in the database", function (done) {
        co(function * () {
            yield db.questions.insert({title: 'Question Q1'});
            yield db.questions.insert({title: 'Question Q2'});

            request
                .get("/")
                .expect(200)
                .expect(function (res) {
                    res.text.should.containEql("Question Q1");
                    res.text.should.containEql("Question Q2");
                })
                .end(done);
        });
    });
});