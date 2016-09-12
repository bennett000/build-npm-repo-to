/**
 * This module provides promised based shortcuts to the `npm` command
 *
 * @module childProcess/npm
 */

module.exports = {
  install,
  build,
};

const COMMAND = 'npm';
const FLAG_INSTALL = 'install';
const FLAG_RUN = 'run';
const FLAG_BUILD = 'build';
const { defaultLogger } = require('./util');

/** rewiring this @todo rewrite as partial application */
/* eslint prefer-const: 0 */
let cproc = require('./child-process');

/**
 * @returns {Promise}
 */
function install() {
  return cproc.stream(COMMAND, [FLAG_INSTALL], {
    env: process.env,
  });
}

/**
 * @param {function(...)} logger
 * @returns {Promise}
 */
function build(logger = defaultLogger()) {
  return cproc.stream(COMMAND, [FLAG_RUN, FLAG_BUILD], {
    env: process.env,
  }, logger);
}
