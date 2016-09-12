# build-npm-repo-to

CLI tool that:

- Checks out a git repository
- Runs `npm install`
- Runs `npm run build`
- Copies `dist/*` to a given folder

## Example

To clone and build `https://github.com/user/repo` and copy its built files to `/tmp/dood` use:

```
build-npm-repo-to https://github.com/user/repo /tmp/dood
```

## To Do

- specify custom `dist` folder
- specify custom `npm` command (ie not `run build`)

## Development

To find stories to work on checkout [our board](https://waffle.io/rangle/build-npm-repo-to "build-npm-repo-to work/task board")

- `npm run cover` runs the tests with coverage
- `npm run lint` runs lint
- `npm run mocha` runs mocha (tests) on a watch
- `npm run test` runs tests with linting and coverage

Be sure and ready [the code of conduct](./CODE_OF_CONDUCT.md "Code of Conduct")
