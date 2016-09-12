/**
 * This module contains a variety of generic promise wrapped
 `node.child_process.spawn` commands

 * @module childProcess
 */

/** rewiring this @todo rewrite as partial application */
/* eslint prefer-const:0 */
let spawn = require('child_process').spawn;
const defaultLogger = require('./util').defaultLogger;

module.exports = {
  output,
  stream,
};

/**
 * @param {string} command
 * @param {string} args
 * @returns {string}
 */
function commandStr(command, args) {
  return `${command} ${args.join(' ')}`;
}

/**
 * @param {string} command
 * @param {string} args
 * @param {string|number} code
 * @param {string=} stderr
 * @returns {string}
 */
function failString(command, args, code, stderr = '') {
  return `${commandStr(command, args)} terminated with exit code: ${code} ` +
    stderr;
}

/**
 * @param {string} command
 * @param {string[]} args
 * @param {number} code
 * @param {string=} stderr
 * @returns {Error}
 */
function failError(command, args, code, stderr = '') {
  const numeric = parseInt(code, 10);

  const errString = failString(command, args, numeric, stderr);
  const e = new Error(errString);
  e.code = numeric;

  return e;
}

/**
 * Resolves stdout, rejects with stderr, also streams
 * @param {string} command
 * @param {Array.<string>=} args
 * @param {Object=} opts
 * @returns {Promise<string>}
 */
function output(command, args = [], opts) {
  return new Promise((resolve, reject) => {
    const options = Object.assign({}, opts);
    const child = spawn(command, args, options);

    let stdout = '';
    let stderr = '';

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');

    child.stdout.on('data', (data) => {
      stdout += data;
    });

    child.stderr.on('data', (data) => {
      stderr += data;
    });

    child.on('close', (code) => {
      if (+code) {
        reject(failError(command, args, code, stderr));
      } else {
        resolve(stdout.trim());
      }
    });

    child.stdin.end();
  });
}

/**
 * Only streams stdout/stderr, no output on resolve/reject
 * @param {string} command
 * @param {Array.<string>=} args
 * @param {Object=} opts
 * @param {function(...)} logger
 * @returns {Promise}
 */
function stream(command, args = [], opts, logger = defaultLogger()) {
  return new Promise((resolve, reject) => {
    const options = Object.assign({}, opts);
    const child = spawn(command, args, options);

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');

    child.stdout.on('data', (data) => {
      logger(data);
    });

    child.stderr.on('data', (data) => {
      logger(data);
    });

    child.on('close', (code) => {
      if (+code) {
        reject(failError(command, args, code));
      } else {
        resolve();
      }
    });

    child.stdin.end();
  });
}
