'use struct'

const fs = require('fs');
const https = require('https');
const checker = require('../index');
const helper = checker.helper;

var rule_3 = helper.mergeRules(helper.default_rule_3);

var rules_all = helper.mergeRules(
  helper.default_rule_1,
  helper.default_rule_2,
  helper.default_rule_3,
  helper.default_rule_4,
  helper.default_rule_5
);

var rules_wrong = {
  selector: 'div[class]',
  expect: '12',
  description: '<div> with class attr, the expect data type is wrong'
}

var rule_a = helper.mergeRules(
  helper.default_rule_1,
  helper.default_rule_2
);

var rule_b = {
  selector: 'meta[name="robots"]',
  description: 'HTML has <meta> with attribute name=robots',
  expect: false
};

var rule_c = [
  {
    selector: 'meta[name="og:title"]:gt(1)',
    description: 'number of <meta> with attribute name=og:title greater than 1',
    expect: false
  },
  {
    selector: 'strong:gt(3)',
    description: 'number of <strong> greater than 3',
    expect: false
  }
];

var rule_ab = helper.mergeRules(rule_a, rule_b);

var rule_abc = helper.mergeRules(rule_ab, rule_c);

var path1 = './test/test-pass.html';
var path2 = './test/test-fail.html';
var path3 = './test/test-empty.html';
var url1 = 'https://azure.microsoft.com/zh-tw/';
var url2 = 'https://cloud.google.com/';

checker.check(path1, rule_ab, console);
checker.check(path1, rule_abc, console);

checker.check(path1, rule_3, console);
checker.check(path1, rules_wrong, console);
checker.check(path2, rules_all, console);

checker.check(new Array(2), helper.default_rule_5, console);
checker.check(path1, helper.mergeRules(helper.default_rule_4, helper.default_rule_5), new Array(4));

checker.check(path3, helper.default_rule_1, console);
checker.check(fs.createReadStream(path3), helper.default_rule_2, console);
checker.check(path2, helper.default_rule_4, '//readonly/path');
var rs = fs.createReadStream(path2);
var ws = fs.createWriteStream('./test/output-path2.txt');
checker.check(rs, rules_all, ws);

var outpath1 = './test/output-url1.txt';
https.get(url1, (rs) => {
  checker.check(rs, rules_all, outpath1);
});

var ws = fs.createWriteStream('./test/output-url2.txt');
https.get(url2, (rs) => {
  checker.check(rs, rules_all, ws);
});