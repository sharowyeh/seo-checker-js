# SEO checker js #

**Check given HTML with rules commit the expect on NodeJS**

[![CircleCI](https://circleci.com/gh/sharowyeh/seo-checker-js.svg?style=svg)](https://circleci.com/gh/sharowyeh/seo-checker-js)

## Installation ##

`npm install seo-checker-js`

## Getting Start ##

```js
const checker = require('seo-checker-js');
const helper = checker.helper;

checker.check('file.html', helper.default_rule_1, console);
```

- The first parameter can be file path or [Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams)
- The second parameter is object (or array of objects) with `selector`, `expect` and `description` properties, refer to [Rule section](https://github.com/sharowyeh/seo-checker-js#rule)
- The last parameter can be file path, [Writable stream](https://nodejs.org/api/stream.html#stream_readable_streams) or console

For example:

```js
const fs = require('fs');
const https = require('https');
const checker = require('seo-checker-js');
const helper = checker.helper;

// merge all default rules
var default_rules = helper.mergeRules(
  helper.default_rule_1,
  helper.default_rule_2,
  helper.default_rule_3,
  helper.default_rule_4,
  helper.default_rule_5
);

// get webpage content as readable stream
https.get('https://cloud.google.com/', (rs) => {
  // prepare writable stream for output file
  var ws = fs.createWriteStream('result.txt');
  checker.check(rs, default_rules, ws);
});
```

## Rule ##

The pacakge supports 5 default rules in helper.default_rule_*N*
```
> require('seo-checker-js').helper.default_rule_1
{
  selector: 'img:not([alt])',
  description: '<img> without attibute alt',
  expect: 0
}
```
- `selector` is nearly identical but subset of jquery selector for DOM elements, includes `tag`, `tag child`, `[attribute]`, `[attribute="value"]`, `:not`, `:has`, `:gt`, `:eq` and `:lt`
- `description` description of selector, also the output string if actual value is not expected
- `expect` value of selector result which rule expected, can be number for results count or boolean for result exist

The rules can be customized and combined on demand
```js
const helper = require('seo-checker-js').helper;

var rule_a = helper.mergeRules(
  helper.default_rule_1,
  helper.default_rule_2
);

var rule_b = {
  selector: 'meta[name="robots"]',
  description: 'HTML has <meta name=robots>',
  expect: false
};

var rule_c = [
  {
    selector: 'meta[name="og:title"]:gt(1)',
    description: 'number of <meta name=og:title> greater than 1',
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
```

And after typing lots of rule's usage... it should be had a class to do something more efficiency