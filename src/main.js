module.exports = {
  main,
};

const path = require('path');
const ncp = require('./util').nfbind(require('ncp'));
const { create, destroy } = require('./git');
const { install, build } = require('./npm');

function npmCommands() {
  return install()
    .then(build);
}


function main(repo, dest, dist = '/dist') {
  return create(repo)
    .then((repoDesc) => {

      return npmCommands(repoDesc, dest, dist)
        .then(() => ncp(path.join(repoDesc.path, dist), dest))
        .then(() => destroy(repoDesc.id))
        .catch((err) => destroy(repoDesc.id)
          .then(() => { throw err; }));
    })
    .then(() => undefined);
}
