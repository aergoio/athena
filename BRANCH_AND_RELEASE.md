# Branch model & Release process

## Branch model

### develop/xxx

We have several sub projects as a monorepo. Each project has little in common. So we use develop branch for each sub-project.  
For example, if we are developing athena-analysis, main branch would be `develop/athena-analysis`. Each tag is made in each develop branch.

### master

Master branch holds all the released one.

If some common settings have to be changed in all modules, commit it into master cherry-pick that commit into `develop/xxx` branches

## Release process

Simple release process.

1. `rm -rf ./node_modules && yarn install`
2. Make sure all tests passes (`yarn run test` and `yarn run it` if exists)
3. `yarn run build`
4. Update `CHANGELOG.md`
5. `git tag athena-xxx@vx.x.x`
6. `yarn publish --access public`
7. `git checkout master && git merge`

