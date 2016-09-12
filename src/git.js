/**
 * This module provides promise based shortcuts to `git` commands
 *
 * @module childProcess/git
 */

const TMP = require('os').tmpdir();
const COMMAND = 'git';
const FLAG_CLONE = 'clone';
const FLAG_CHECKOUT = 'checkout';

const path = require('path');
const { defaultLogger, nfbind } = require('./util');
const mkdirp = nfbind(require('mkdirp'));
const rimraf = nfbind(require('rimraf'));

/** rewiring this @todo rewrite as partial application */
/* eslint prefer-const: 0 */
let cproc = require('./child-process');

module.exports = {
  clone,
  create,
  destroy,
  checkout,
  helpers: {
    checkout,
    cloneRepoInDir,
    checkoutIdentifierFromDir,
    getShortRepoName,
  },
};

/**
 * @param {string} identifier ideally a SHA
 * @returns {Promise}
 */
function checkout(identifier) {
  if (!identifier) {
    throw new TypeError('git: clone requires a repository string');
  }
  return cproc.output(COMMAND, [FLAG_CHECKOUT, identifier]);
}

/**
 * @param {string} repo
 * @param {function(...)=} logger
 * @returns {Promise}
 */
function clone(repo, logger = defaultLogger()) {
  if (!repo) {
    throw new TypeError('git: clone requires a repository string');
  }
  return cproc.stream(COMMAND, [FLAG_CLONE, repo], logger);
}

/**
 * Strips a git URL into a short name (no .git or http://...)
 * @param {string} repo
 * @returns {string}
 */
function getShortRepoName(repo) {
  const split = repo.split('/');
  const lastString = split[split.length - 1];

  return lastString.slice(lastString.length - 4) === '.git' ?
      lastString.slice(0, lastString.length - 4) : lastString;
}

/**
 * @param {string} repo
 * @param {string} dir
 * @returns {Promise}
 */
function cloneRepoInDir(repo, dir) {
  process.chdir(dir);
  return clone(repo);
}

/**
 * @param {string} identifier
 * @param {string} dir
 * @returns {Promise}
 */
function checkoutIdentifierFromDir(identifier, dir) {
  process.chdir(dir);
  return checkout(identifier);
}

/**
 * @param {string} repo
 * @param {string=} identifier (master)
 * @return {Promise<{ id: string, path: string }>}
 */
function create(repo, identifier = 'master') {
  const repoId =
    (+Date.now()).toString(16) + Math.floor(Math.random() * 100000);
  const namespacePath = path.normalize(TMP + '/' + repoId);
  const repoShort = getShortRepoName(repo);
  const repoDesc = {
    id: repoId,
    path: path.join(namespacePath, repoShort),
  };

  return mkdirp(namespacePath)
    .then(() => cloneRepoInDir(repo, namespacePath))
    .then(() => checkoutIdentifierFromDir(identifier, repoDesc.path))
    .then(() => repoDesc );
}


/**
 * @param {string} repoId
 */
function destroy(repoId) {
  process.chdir(path.normalize(TMP));
  return rimraf(path.normalize(TMP + '/' + repoId));
}

