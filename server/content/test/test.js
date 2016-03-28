var should = require('should');
var Note = require('../note').Note;
var MenuMark = require('../note').MenuMark;
var ListMark = require('../note').ListMark;
var checkInputPath = require('../note').checkInputPath;
var checkOutPath = require('../note').checkOutPath;
describe('note', function() {
  var note = new Note('./test.md');
  describe('#getTitle()', function () {
    it('should return a string', function () {
    	note.getTitle().should.be.a.String();
    });
  });

  describe('#getBirthTime()', function () {
    it('should return a date', function (done) {
        note.getBirthTime().then(function (time) {
           time.should.be.a.Date();
            done();
        })
    });
  });

  describe('#getText()', function () {
    it('should return a string', function (done) {
        note.getText().then(function(text){
            text.should.be.a.String();
            done();
        });
    });
  });

  describe('#getMarkdown()', function () {
    it('should return a markdown', function (done) {
        note.getMarkdown().then(data=>{
            data.should.not.be.empty();
            data.should.be.a.String();
            done();
        });
    });
  });
});

describe('MenuMark', function  () {
    describe('#readDir', function () {
        it('should return a array, and length is 1', function (done) {
            var menumark = new MenuMark('../../content');
            menumark.readDir().then(function (result) {
                result.should.be.a.Array();
                result.should.lengthOf(1);
                done();
            })
        })
    })
    
    describe('#getList', function () {
        it('should return a array, and length is 1', function (done) {
            var menumark = new MenuMark('../../content');
            menumark.getList('../../content').then(function (result) {
                result.should.be.a.Array();
                result.should.lengthOf(1);
                done();
            })
        })
    })

})

describe('Listmark', function  () {

    describe('#getPath', function () {
        it('should return a array, and length is 6', function (done) {
            var listmark = new ListMark('../../content');
            listmark.getPath('../../content').then(function (result) {
                result.should.be.a.Array();
                result.should.lengthOf(6);
                done();
            })
        })
    })


    describe('#allMarkFile', function () {
        it('should return a array, and length is 7', function (done) {
            var listmark = new ListMark('../../content');
            listmark.allMarkFile().then(function (result) {
                result.should.be.a.Array();
                result.should.lengthOf(7);
                done();
            })
        })
    })
})

describe('checkpath', function  () {
    var basepath = '/root/home/kevin/nihao/sdf';
    describe('#checkInputPath', function () {
        it('should return \'\' and ', function () {
            var testargu1 = checkInputPath(basepath, '../hel/sss/');
            testargu1.should.equal('')
            var test2 = checkInputPath(basepath, '/hel/sss/s');
            test2.should.be.a.String();
            test2.should.equal('/root/home/kevin/nihao/sdf/hel/sss/s');
        })
    })


    describe('#checkOutPath', function () {
        it('should return', function () {
            var test1 =  checkOutPath(basepath, '/root/home/kevin/nihao/sdf/sdfsdf/ddd');
            test1.should.equal('/sdfsdf/ddd');
        })
    })
})