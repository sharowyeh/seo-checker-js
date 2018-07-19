'use strict'

const cheerio = require('cheerio');
const _ = {
  defaults: require('lodash/defaults')
};
const Rule = require('./rule');

/**
 * Parser class implemented methods getting results of SEO tags from query operation.
 * 
 * - The pseudo privacy methods(with underscore prefix) still are public callees
 *   [Proposal of field declarations](https://github.com/tc39/proposal-class-fields)
 *   If it needs private methods:
 *   - uses ES5 function declaration for package, call private function inside of declaration
 *   - define function outside of class scope, bind function inside of class function
 */
class Parser {
  /** 
   * Given html string and rules with selectors
   * for getting results of SEO tags from query operation.
   * @param {string} data html string
   * @param {(Rule|Rule[])} rules a rule or list of rules with selector
   * @param {object} options dict of cheerio load options, default is {}
   */
  constructor(data, rules, options = {}) {
    // htmlparser2 options: https://github.com/fb55/htmlparser2/wiki/Parser-options
    // cheerio options: https://github.com/cheeriojs/cheerio#loading
    this._options = {
      lowerCaseTags: true,
      lowerCaseAttributeNames: false,
      xmlMode: false
    };
    // Overwrite default options
    this._options = _.defaults(options, this._options);
    this._$ = cheerio.load(data, this._options);
    // Make array if rules is not array
    if (!Array.isArray(rules)) {
      rules = [rules];
    }
    // Consider using ES6 Map feature for key-pair results
    this._results = new Map();
    //this._results = {};
    rules.forEach((rule) => {
      this._results.set(rule.selector, rule);
      this._extendSelector(rule.selector);
    });
  }

  /**
   * Greater than given index of selected tags
   * @param {string} selector selector string for cheerio call
   * @param {number} idx zero based index of selected tags
   * @returns {object} DOM elements of tags which thier index greater than given index
   */
  _gt(selector, idx) {
    let query = this._$(selector);
    let tags = query.slice(idx).get();
    return tags;
  }

  /**
   * Less then given index of selected tags
   * @param {string} selector selector string for cheerio call
   * @param {number} idx zero based index of selected tags
   * @returns {object} DOM elements of tags which thier index less than given index
   */
  _lt(selector, idx) {
    let query = this._$(selector);
    let tags = query.slice(0, idx).get();
    return tags;
  }

  /**
   * Equals given index of selected tags
   * @param {string} selector selector string for cheerio call
   * @param {number} idx zero based index of selected tags
   * @returns {object} DOM element of tag which its index equlas to given index
   */
  _eq(selector, idx) {
    let query = this._$(selector);
    let tags = query.eq(idx).get();
    return tags;
  }

  /**
   * Extended selector function with addtional :gt(idx) :lt(idx) :eq(idx)
   * @param {string} selector selector string for cheerio call
   */
  _extendSelector(selector) {
    // Regular expression for :gt(idx) :lt(idx) :eq(idx) as final filters of selector
    // For more essentail regular expressions of selector, dig out here:
    // https://github.com/jquery/jquery/blob/master/external/sizzle/dist/sizzle.js#L72
    let expr = /(.*):(gt|lt|eq)\((\d+)\)/gi;
    if (expr.test(selector)) {
      selector.replace(expr, (match, partial, act, idx, offset, str) => {
        let func_name = '_' + act.toLowerCase();
        this._results.get(selector).tags = this[func_name](partial, idx);
      });
    } else {
      // Use default selector function, exception occurred if selector is not supported
      // For node module selector pseudos:
      // https://github.com/fb55/css-select/blob/master/lib/pseudos.js
      let query = this._$(selector);
      let tags = query.get();
      this._results.get(selector).tags = tags;
    }
  }

  /**
   * Get selector array
   * @return {object} list of all selectors
   */
  getSelectors() {
    let keys = [...this._results.keys()];
    return keys;
  }

  /**
   * Get tag elements which parsed by selector
   * @param {?string} selector selector string of results, nullable if parser only has one selector
   * @returns {object} DOM elements of tags
   */
  getTags(selector = null) {
    if (this._results.size == 1) {
      return this._results.values().next().value.tags;
    }
    if (!(this._results.has(selector))) {
      console.log(`Given selector=${selector} does not exist in results`);
      return null;
    }
    return this._results.get(selector).tags;
  }

  /**
   * Get tags count which parsed by selector
   * @param {?string} selector selector string of results, nullable if parser only has one selector
   * @returns {number} tags count
   */
  getCount(selector = null) {
    let tags = this.getTags(selector);
    return tags ? tags.length : -1;
  }

  /**
   * Get kay-pair Map results
   * @returns {Map<string, object>} results of parsed rules
   */
  getResults() {
    return this._results;
  }
  
}

module.exports = Parser;
