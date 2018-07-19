const should = require('should');
const fs = require('fs');
const checker = require('../src/checker');
const Parser = require('../src/parser');

describe('checker functions', () => {
  it('loadFile method', (done) => {
    var p_resolved = checker.loadFile('./test/test-pass.html', checker.rule_img_without_alt);
    p_resolved.should.be.Promise();
    p_resolved.should.be.finally.instanceOf(Parser);

    var p_rejected1 = checker.loadFile('./test/test-empty.html', checker.rule_img_without_alt);
    p_rejected1.should.be.Promise();
    p_rejected1.should.be.rejected();
    
    var p_rejected2 = checker.loadFile('/no-such-path', checker.rule_img_without_alt);
    p_rejected2.should.be.Promise();
    p_rejected2.should.be.rejected();
    
    done();
  });

  it('loadStream method', (done) => {
    var rs1 = fs.createReadStream('./test/test-fail.html');
    var p_resolved = checker.loadStream(rs1, checker.rule_img_without_alt);
    p_resolved.should.be.Promise();
    p_resolved.should.be.resolved();

    var rs2 = fs.createReadStream('./test/test-empty.html');
    var p_rejected1 = checker.loadStream(rs2, checker.rule_img_without_alt);
    p_rejected1.should.be.Promise();
    p_rejected1.should.be.rejected();

    var rs3 = fs.createReadStream('/no-such-path');
    var p_rejected2 = checker.loadStream(rs3, checker.rule_img_without_alt);
    p_rejected2.should.be.Promise();
    p_rejected2.should.be.rejected();
    done();
  });

  it('writeFile method', (done) => {
    var test_file = './test/out-test-file.log';
    if (fs.existsSync(test_file)) {
      fs.unlinkSync(test_file);
    }
    var p_resloved = checker.writeFile(test_file, '1234');
    p_resloved.should.be.Promise();
    p_resloved.should.be.resolved();

    var p_rejected = checker.writeFile('//no-such-path', '0');
    p_rejected.should.be.Promise();
    p_rejected.should.be.rejected();

    done();
  });

  it('writeStream method, writeConsole', (done) => {
    var test_file = './test/out-test-stream.log';
    if (fs.existsSync(test_file)) {
      fs.unlinkSync(test_file);
    }
    var ws = fs.createWriteStream(test_file);
    var p_resloved = checker.writeStream(ws, '1234');
    p_resloved.should.be.Promise();
    p_resloved.should.be.resolved();

    checker.writeConsole(console, 'test writeConsole');
    done();
  });;

  it('buildOutput method', (done) => {
    var data_fail = fs.readFileSync('./test/test-fail.html');
    var par_fail = new Parser(data_fail, checker.rule_img_without_alt);
    var output_from_number_rule = checker.buildOutput(par_fail.getResults());
    output_from_number_rule.length.should.be.above(0);

    par_fail = new Parser(data_fail, checker.rule_strong_gt_15);
    var output_from_bool_rule = checker.buildOutput(par_fail.getResults());
    output_from_bool_rule.length.should.be.above(0);
    // Make exception manually
    var results = par_fail.getResults();
    results.values().next().value.expect = 'string-not-support';
    var output_failed = checker.buildOutput(results);
    output_failed.length.should.be.exactly(0);
    done();
  });

  it('check method', (done) => {
    var read_file = './test/test-fail.html';
    var write_file = './test/out-test-check.log';

    var fail_source = ['not a', 'valid type'];
    checker.check(fail_source, checker.rule_img_without_alt, write_file);
    var fail_target = { not: 'a', valid: 'type' };
    checker.check(read_file, checker.rule_img_without_alt, fail_target);

    checker.check(read_file, checker.rule_img_without_alt, console);

    var rs = fs.createReadStream(read_file);
    var ws = fs.createWriteStream(write_file);
    checker.check(rs, checker.rule_img_without_alt, ws);
    
    var all = checker.mergeRules(
      checker.rule_img_without_alt,
      checker.rule_a_without_rel,
      checker.rule_head_has_title_and_meta,
      checker.rule_strong_gt_15,
      checker.rule_h1_gt_1
    );
    checker.check(read_file, all, write_file);
    done();
  });
});