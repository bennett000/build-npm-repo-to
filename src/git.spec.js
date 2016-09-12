const rewire = require('rewire');

const git = rewire('./git');
const C = require('./chai');

/* global describe, it, expect, beforeEach, afterEach */
describe('Test git CLI Wrapper', () => {
  let cProc;
  let workDir;

  beforeEach(() => {
    workDir = process.cwd();
    cProc = git.__get__('cproc');
    git.__set__('cproc', {
      output: Promise.resolve.bind(Promise),
      stream: Promise.resolve.bind(Promise),
    });
  });

  afterEach(() => {
    process.chdir(workDir);
    git.__set__('cproc', cProc);
  });

  it('clone should resolve if there are no exit errors', (done) => {
    git.clone('some-repo').then(() => C
      .check(done, () => expect(true).to.be.ok ))
      .catch(C.getFail(done));
  });

  it('clone should throw if not given a repo', () => {
    expect(() => {
      git.clone();
    }).to.throw(TypeError);
  });

  it('cloneRepoFromDir should resolve if there are no exit errors', (done) => {
    git
      .helpers
      .cloneRepoInDir('repo', require('os').tmpdir())
      .then(() =>
        C.check(done, () => expect(true).to.be.ok))
      .catch(C.getFail(done));
  });

  it('checkoutIdentifierFromDir should resolve if there are no exit errors',
    (done) => {
      git
        .helpers
        .checkoutIdentifierFromDir('id', require('os').tmpdir())
        .then(() =>
          C.check(done, () => expect(true).to.be.ok))
        .catch(C.getFail(done));
    });

  it('getShortRepoName should return the name portion of a uri', () => {
    expect(git.helpers.getShortRepoName('blah/bha/hello.git'))
      .to.equal('hello');
  });

  it('destroy should always resolve', (done) => {
    git
      .destroy('some randome temp object')
      .then(() => C
        .check(done, () => expect(true).to.be.ok))
      .catch(C.getFail(done));
  });
});
