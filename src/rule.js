'use struct'

const _ = {
  clone: require('lodash/clone')
};

class Rule {
  /**
   * Given element will be checked with rule functions,
   * or checked in entire HTML if no applied rule
   * @param {string} tag tag name, can be empty but not null or undefined
   * @param {?string} attr attribute name, nullable if not specific 
   * @param {?string} value attribute value, nullable if not specific, ignored if attribute not specific
   */
  constructor(tag='', attr=null, value=null) {
    if (tag.length == 0 && !attr) {
      tag = 'html';
    }
    this._tag = tag;
    this._attr = attr;
    this._value = value;
    // build left-side element selector
    this._left = this._getSelector(tag, attr, value);
    // default uses left-side element to performing jquery
    this._default();
  }

  /**
   * Get selector string by given tag name, attribute name and attribute value
   * @param {string} tag tag name, can be empty but not null or undefined
   * @param {?string} attr attribute name, nullable if not specific 
   * @param {?string} value attribute value, nullable if not specific, ignored if attribute not specific
   */
  _getSelector(tag='', attr=null, value=null) {
    // formats: tag, [attr], tag[attr], [attr="value"] or tag[attr="value"]
    return `${tag}${(attr)?`[${attr}${(value)?`="${value}"`:``}]`:``}`;
  }

  _default() {
    this.selector = this._left;
    this.expect = true;
    this.failed = `HTML does not have ${this._left}`;
  }

  /**
   * Clone rule
   * @returns {Rule} new instance of this rule
   */
  clone() {
    return _.clone(this);
  }

  /**
   * Expect number of elements which with given element
   * @param {string} tag tag name, can be empty but not null or undefined
   * @param {?string} attr attribute name, nullable if not specific 
   * @param {?string} value attribute value, nullable if not specific, ignored if attribute not specific
   * @param {number} expect expected number of count
   * @returns {Rule} return self instance
   */
  with(tag='', attr=null, value=null, expect=1) {
    // build right-side element selector
    this._right = this._getSelector(tag, attr, value);
    let sign = '';
    // if left has element, and right element is tag or both are attributes, jquery selector is '>'
    if ((this._left) && (tag.length > 0 || (attr && this._attr))) {
      sign = '>';
    }
    this.selector = `${this._left}${sign}${this._right}`;
    this.failed = `number of ${this._left} with ${this._right} expect=${expect} actual=`;
    this.expect = expect;
    return this;
  }

  /**
   * Expected number of elements which without given attribute (given tag is meanless)
   * @param {string} attr without attribute name
   * @param {?string} value without attribute value, nullable if not specific
   * @param {number} expect expected number of count
   * @returns {Rule} return self instance
   */
  without(attr, value=null, expect=0) {
    // :not only can select attribute
    this._right = this._getSelector('', attr, value);
    this.selector = `${this._left}:not(${this._right})`;
    this.failed = `number of ${this._left} without ${this._right} expect=${expect} actual=`;
    this.expect = expect;
    return this;
  }

  /**
   * The element has given element
   * @param {string} tag tag name, can be empty but not null or undefined
   * @param {?string} attr attribute name, nullable if not specific 
   * @param {?string} value attribute value, nullable if not specific, ignored if attribute not specific
   * @returns {Rule} return self instance
   */
  included(tag='', attr=null, value=null) {
    // :has and expect is true
    // function different with `with(name, type, value, expect=1)` is:
    //   - the left element will be searched, all of them must have given right element
    this._right = this._getSelector(tag, attr, value);
    this.selector = `${this._left}:has(${this._right})`;
    this.failed = `${this._left} does not have ${this._right}`;
    this.expect = true;
    return this;
  }

  /**
   * The element does not have given element
   * @param {string} tag tag name, can be empty but not null or undefined
   * @param {?string} attr attribute name, nullable if not specific 
   * @param {?string} value attribute value, nullable if not specific, ignored if attribute not specific
   * @returns {Rule} return self instance
   */
  excluded(tag='', attr=null, value=null) {
    // :has and expect is false
    this._right = this._getSelector(tag, attr, value);
    this.selector = `${this._left}:has(${this._right})`;
    this.failed = `${this._left} has ${this._right}`;
    this.expect = false;
    return this;
  }

  /**
   * The element's count is greater than given couting number
   * @param {number} count Given counting number
   * @returns {Rule} return self instance
   */
  greater(count) {
    // :gt(count) and expect is false
    this.selector = `${this._left}:gt(${count})`;
    this.failed = `number of ${this._left} greater than ${count}`;
    this.expect = false;
    return this;
  }
}

module.exports = Rule;