const rewire = require('rewire');

const npm = rewire('./npm');
const C = require('./chai');

/* global describe, it, expect, beforeEach, afterEach */
describe('Test npm CLI Wrapper', () => {
  let cProc;

  beforeEach(() => {
    cProc = npm.__get__('cproc');
    npm.__set__('cproc', {
      output: Promise.resolve.bind(Promise),
      stream: Promise.resolve.bind(Promise),
    });
  });

  afterEach(() => {
    npm.__set__('cproc', cProc);
  });


  it('install should resolve if there are no exit errors', (done) => {
    npm
      .install()
      .then(() =>
        C.check(done, () => expect(true).to.be.ok))
      .catch(C.getFail(done));
  });

  it('build should resolve if there are no exit errors', (done) => {
    npm
      .build()
      .then(() =>
        C.check(done, () => expect(true).to.be.ok))
      .catch(C.getFail(done));
  });
});
