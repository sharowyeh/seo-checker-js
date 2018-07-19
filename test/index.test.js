const checker = require('../src/checker');

let rule1 = checker.rule_img_without_alt;
console.log(rule1.selector, rule1.failed, rule1.expect);

let rule4 = checker.rule_strong_gt_15.clone();
console.log(rule4.selector, rule4.failed, rule4.expect);
rule4.greater(5);

console.log('---')
checker.check('./test/test-fail.html', checker.rule_strong_gt_15, console);

let rule3 = checker.rule_head_has_title_and_meta;

let rules = checker.mergeRules(rule1, rule3, rule4);
rules.forEach((rule) => {
  console.log(rule.selector, rule.failed);
})

let rule_htm = new checker.Rule();
console.log(rule_htm.selector);

// HTML has meta[name="robots"]
let rule_custom = new checker.Rule('html').excluded('meta', 'name', 'robots');
console.log(rule_custom.selector, rule_custom.failed);
console.log('---')
checker.check('./test/test-pass.html', rule_custom, console);

var all = checker.mergeRules(
  checker.rule_img_without_alt,
  checker.rule_a_without_rel,
  checker.rule_head_has_title_and_meta,
  checker.rule_strong_gt_15,
  checker.rule_h1_gt_1
);
checker.check('./test/test-fail.html', all, './test/out-test-output.log');