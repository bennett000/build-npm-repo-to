const rewire = require('rewire');
const mockSpawn = require('mock-spawn');

const child = rewire('./child-process');
const C = require('./chai');

/* global describe, it, expect, beforeEach, afterEach */
describe('Test git CLI Wrapper', () => {
  beforeEach(() => {
    child.__set__('spawn', mockSpawn());
  });

  afterEach(() => {
    child.__set__('spawn', require('child_process').spawn);
  });


  it('output should resolve if there are no exit errors', (done) => {
    child.output('ls')
      .then(() => C
        .check(done, () => expect(true).to.be.ok))
      .catch(C.getFail(done));
  });

  it('stream should resolve if there are no exit errors', (done) => {
    child.stream('ls')
      .then(() => C
        .check(done, () => expect(true).to.be.ok))
      .catch(C.getFail(done));
  });

  describe('cases with exit code', () => {
    beforeEach(() => {
      const ms = mockSpawn();
      const runner = ms.simple(1, '');

      runner.stderr = 'test error';
      ms.setDefault(runner);
      child.__set__('spawn', ms);
    });

    it('output should reject if there are exit errors', (done) => {
      child.output()
        .then(C.getFail(done))
        .catch((err) => C
          .check(done, () => expect(err instanceof Error).to.be.ok));
    });

    it('stream should reject if there are exit errors', (done) => {
      child.stream()
        .then(C.getFail(done))
        .catch((err) => C
          .check(done, () => expect(err instanceof Error).to.be.ok));
    });
  });
});
