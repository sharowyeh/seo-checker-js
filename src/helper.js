'use struct'

/**
 * img tag does not with alt attribute
 */
const default_rule_1 = {
  selector: 'img:not([alt])',
  description: '<img> without attibute alt',
  expect: 0
};

/**
 * a tag does not with rel attribute
 */
const default_rule_2 = {
  selector: 'a:not([rel])',
  description: '<a> without attribute rel',
  expect: 0
};

/**
 * head tag does not have title or meta name="descriptions" or meta name="keywords"
 */
const default_rule_3 = [
  {
    selector: 'head:has(title)',
    description: '<head> has <title>',
    expect: true
  },
  {
    selector: 'head:has(meta[name="descriptions"])',
    description: '<head> has <meta> with attribute name="descriptions"',
    expect: true
  },
  {
    selector: 'head:has(meta[name="keywords"])',
    description: '<head> has <meta> with attribute name="keywords"',
    expect: true
  }
];

/**
 * number of strong tags greater than 15
 */
const default_rule_4 = {
  selector: 'strong:gt(15)',
  description: 'number of <strong> greater than 15',
  expect: false
};

/**
 * number of h1 tags greater then 1
 */
const default_rule_5 = {
  selector: 'h1:gt(1)',
  description: 'number of <h1> greater than 1',
  expect: false
};

/**
 * Merge multiple rule
 * @param {object[]} rules given multiple rule or list of rules
 * @returns combined list of rules
 */
function mergeRules(...rules) {
  let combined = [];
  rules.forEach((rule) => {
    if (Array.isArray(rule)) {
      combined = combined.concat(rule);
    } else {
      combined.push(rule);
    }
  });
  return combined;
}

module.exports = {
  default_rule_1,
  default_rule_2,
  default_rule_3,
  default_rule_4,
  default_rule_5,
  mergeRules
};
