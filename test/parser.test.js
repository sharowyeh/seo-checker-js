const should = require('should');
const fs = require('fs');
const Parser = require('../src/parser');
const checker = require('../src/checker');

var rules_all = [
  checker.rule_img_without_alt,
  checker.rule_a_without_rel,
  checker.rule_head_has_title_and_meta,
  checker.rule_strong_gt_15,
  checker.rule_h1_gt_1
];

var data_pass = fs.readFileSync('./test/test-pass.html');
var data_fail = fs.readFileSync('./test/test-fail.html');

describe('parser implementation', () => {
  var par_pass = new Parser(data_pass, rules_all);
  var par_fail = new Parser(data_fail, rules_all, {lowerCaseTags:false});
  it('initialize parser', (done) => {
    should.exist(par_pass._$);
    should.exist(par_fail._$);
    should(par_pass._results instanceof Map).be.true();
    should(par_fail._results instanceof Map).be.true();
    done();
  });

  it('_gt method', (done) => {
    // pass data has 4 strong tags
    var tags = par_pass._gt('strong', 4);
    tags.should.be.Array();
    should.equal(tags.length, 0);
    // pass data has 2 name attribute
    tags = par_pass._gt('[name]', 1);
    tags.should.be.Array();
    should.equal(tags.length, 1);
    // failed data has 17 strong tags
    tags = par_fail._gt('strong', 15);
    tags.should.be.Array();
    should.equal(tags.length, 2);
    done();
  });

  it('_lt method', (done) => {
    // pass data has one title tag in head tag
    var tags = par_pass._lt('head>title', 3);
    tags.should.be.Array();
    should.equal(tags.length, 1);
    // pass data has 2 meta with name attribute
    tags = par_pass._lt('meta[name]', 5);
    tags.should.be.Array();
    should.equal(tags.length, 2);
    // failed data has 17 strong tags
    tags = par_fail._lt('strong', 6);
    tags.should.be.Array();
    should.equal(tags.length, 6);
    done();
  });

  it('_eq method', (done) => {
    // pass data has 3 img tags with alt attribute
    var tags = par_pass._eq('img[alt]', 2);
    tags.should.be.Array();
    should.equal(tags.length, 1);
    tags = par_pass._eq('img[alt]', 4);
    tags.should.be.Array();
    should.equal(tags.length, 0);
    done();
  });

  it('_extendSelector method for :gt :lt :eq and getTags method', (done) => {
    // :gt should call to _gt, otherwise exception occurred from cheerio
    // pass data has 2 name attributes
    var key = '[name]:gt(1)';
    // set test keypair to _results
    par_pass._results.set(key, { tags: ''});
    par_pass._extendSelector(key);
    var tags = par_pass.getTags(key);
    tags.should.be.Array();
    should.equal(tags.length, 1);
    // delete test keypair from _results
    par_pass._results.delete(key);

    // :lt should call to _lt, otherwise exception occurred from cheerio
    // pass data only has 1 title in head
    key = 'head>title:lt(3)';
    // set test keypair to _results
    par_pass._results.set(key, { tags: ''});
    par_pass._extendSelector(key);
    var tags = par_pass.getTags(key);
    tags.should.be.Array();
    should.equal(tags.length, 1);
    // delete test keypair from _results
    par_pass._results.delete(key);

    // :eq should call to _eq, otherwise exception occurred from cheerio
    // pass data has 3 img tags with alt attribute
    key = 'img[alt]:eq(2)';
    // set test keypair to _results
    par_pass._results.set(key, { tags: ''});
    par_pass._extendSelector(key);
    var tags = par_pass.getTags(key);
    tags.should.be.Array();
    should.equal(tags.length, 1);
    // delete test keypair from _results
    par_pass._results.delete(key);

    // others call to cheerio
    // pass data has 2 a tags with rel attribute
    key = 'a[rel]';
    // set test keypair to _results
    par_pass._results.set(key, { tags: ''});
    par_pass._extendSelector(key);
    var tags = par_pass.getTags(key);
    tags.should.be.Array();
    // a tag duplicated represent at div tag
    should.equal(tags.length, (2+1));
    // delete test keypair from _results
    par_pass._results.delete(key);
    done();
  });

  it('getSelectors method, getCount method', (done) => {
    var selectors = par_fail.getSelectors();
    selectors.should.be.Array();
    selectors.length.should.be.above(0);

    var fail1_count = par_fail.getCount(selectors[0]);
    fail1_count.should.be.Number();

    var negative = par_fail.getCount('no-such-key');
    negative.should.be.below(0);
    // single selector can ignored given parameter
    var par_single = new Parser(data_fail, checker.rule_img_without_alt);
    var tag = par_single.getTags();
    should.exist(tag);
    done();
  });
})