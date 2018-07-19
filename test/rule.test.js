const should = require('should');
const Rule = require('../src/rule');

describe('rule implementation', () => {
  var rule_tag = new Rule('head');
  var rule_attr = new Rule('', 'class');
  var rule_tag_attr_value = new Rule('meta', 'name', 'keywords');

  it('initialize rule', (done) => {
    should.equal(rule_tag.selector, 'head');
    should.equal(rule_attr.selector, '[class]');
    should.equal(rule_tag_attr_value.selector, 'meta[name="keywords"]');
    var rule_tag_attr = new Rule('meta', 'name');
    should.equal(rule_tag_attr.selector, 'meta[name]');
    var rule_html = new Rule();
    should.equal(rule_html.selector, 'html');
    done();
  });

  it('clone method', (done) => {
    var rule_custom = rule_tag.clone();
    rule_custom.greater(1);
    should.equal(rule_custom.selector, 'head:gt(1)');
    should.equal(rule_tag.selector, 'head');
    var rule_ref = rule_custom;
    rule_ref.greater(4);
    should.equal(rule_custom.selector, 'head:gt(4)');
    done();
  });

  it('with method', (done) => {
    rule_tag.with('meta');
    // right side is tag should have >
    should.equal(rule_tag.selector, 'head>meta');
    rule_tag.with('meta', 'name', 'keywords');
    should.equal(rule_tag.selector, 'head>meta[name="keywords"]');
    // right side is attribute
    rule_tag.with('', 'class', 'head-class');
    should.equal(rule_tag.selector, 'head[class="head-class"]');
    // right side is tag or both sides are attribute should have >
    rule_attr.with('strong');
    should.equal(rule_attr.selector, '[class]>strong');
    rule_attr.with('', 'name', 'description');
    should.equal(rule_attr.selector, '[class]>[name="description"]');
    done();
  });

  it('without method', (done) => {
    // without only appied attribute
    var rule_img = new Rule('img');
    rule_img.without('alt');
    should.equal(rule_img.selector, 'img:not([alt])');
    var rule_meta = new Rule('meta');
    rule_meta.without('name', 'robots');
    should.equal(rule_meta.selector, 'meta:not([name="robots"])');
    done();
  });

  it('include/exclude method', (done) => {
    rule_tag.included('title');
    should.equal(rule_tag.selector, 'head:has(title)');
    should.equal(rule_tag.expect, true);
    rule_tag.included('meta', 'name', 'keywords');
    should.equal(rule_tag.selector, 'head:has(meta[name="keywords"])');
    should.equal(rule_tag.expect, true);
    rule_tag.excluded('title');
    should.equal(rule_tag.selector, 'head:has(title)');
    should.equal(rule_tag.expect, false);
    rule_tag.excluded('meta', 'name', 'keywords');
    should.equal(rule_tag.selector, 'head:has(meta[name="keywords"])');
    should.equal(rule_tag.expect, false);
    done();
  });

  it('greater than method', (done) => {
    var rule_strong = new Rule('strong');
    rule_strong.greater(5);
    should.equal(rule_strong.selector, 'strong:gt(5)');
    should.equal(rule_strong.expect, false);
    var rule_ogtitle = new Rule('', 'name', 'og:title');
    rule_ogtitle.greater(1);
    should.equal(rule_ogtitle.selector, '[name="og:title"]:gt(1)');
    should.equal(rule_strong.expect, false);
    done();
  });
});