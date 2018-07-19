# SEO checker js #

**Check given HTML with rules commit the expect on NodeJS**

[![CircleCI](https://circleci.com/gh/sharowyeh/seo-checker-js.svg?style=svg)](https://circleci.com/gh/sharowyeh/seo-checker-js)

## Installation ##

`npm install seo-checker-js`

## Getting Start ##

```js
const checker = require('seo-checker-js');

checker.check('file.html', checker.rule_img_without_alt, console);
```

- The first parameter can be file path or [Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams)
- The second parameter is object (or array of objects) of [Rule](https://github.com/sharowyeh/seo-checker-js#rule)
- The last parameter can be file path, [Writable stream](https://nodejs.org/api/stream.html#stream_readable_streams) or console

For example:

```js
const fs = require('fs');
const https = require('https');
const checker = require('seo-checker-js');

// merge all default rules
var default_rules = checker.mergeRules(
  checker.rule_img_without_alt,
  checker.rule_a_without_rel,
  checker.rule_head_has_title_and_meta,
  checker.rule_strong_gt_15,
  checker.rule_h1_gt_1
);

// get webpage content as readable stream
https.get('https://cloud.google.com/', (rs) => {
  // prepare writable stream for output file
  var ws = fs.createWriteStream('result.txt');
  checker.check(rs, default_rules, ws);
});
```

## Rule ##

The pacakge supports 5 default rules in this pacakge:
- `rule_img_without_alt` - shows number of `<img>` without `alt` attrubite
- `rule_a_without_rel` - shows number of `<a>` without `rel` attribute
- `rule_head_has_title_and_meta` -
  - shows `<head>` does not have `<title>`
  - shows `<head>` does not have `<meta name="descriptions">`
  - shows `<head>` does not have `<meta name="keywords">`
- `rule_strong_gt_15` - shows html has more than 15 `<strong>`
- `rule_h1_gt_1` - shows html has more than 1 `<h1>`

Rule also can be customized, for example:

We want to show if html has more than 5 `<strong>` tags, and have another rule checking `<meta name="robots">` exists
```js
const checker = require('seo-checker-js');

// just clone from default rule for strong tag
let rule_custom1 = checker.rule_strong_gt_15.clone();
// assign new counting number 
rule_custom1.greater(5);
// create a new rule check if html has <meta name="robots">
let rule_custom2 = new checker.Rule('html').included('meta', 'name', 'robots');
// Merge rules
let rules = checker.mergeRules(rule_custom1, rule_custom2);
// Do check output to file
checker.check('input.html', rules, 'output.log');
```

- `.with()` number of elements with given element, shows result if not expected

- `.without()` number of elements without given attribute, shows result if not expected

- `.included()` element should have given element, shows message if not expected

- `.excluded()` element shouldn't contain given element, shows message if not expected

- `.greater()` number of elements shouldn't be greater than given number, shows message if not expected

Rule supported methods all have JSDoc for reference


## Output ##

output will be looks like:
```
number of img without [alt] expect=0 actual=2
number of a without [rel] expect=0 actual=2
head does not have title
head does not have meta[name="descriptions"]
head does not have meta[name="keywords"]
number of strong greater than 15
number of h1 greater than 1
```
