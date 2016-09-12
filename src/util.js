module.exports = {
  defaultLogger,
  nfbind,
};

function defaultLogger() {
  /* eslint no-console: 0 */
  return console.log.bind(console);
}

/**
 * @param {function(...)} fn
 * @returns {function(...): Promise}
 */
function nfbind(fn) {
  return (...args) => new Promise((resolve, reject) => {
    fn(...args, (err, ...results) => {
      if (err) {
        reject(err);
      } else {
        resolve(...results);
      }
    });
  });
}
