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

1. Clean up repository : `rm -rf ../../node_modules && yarn install`
2. Make sure all tests passes (`yarn run test` and `yarn run it` if exists)
3. Build: `yarn run build`
4. Update `CHANGELOG.md` && change version of `package.json`
5. Commit step 4 changes : `git commit -m "Prepare for athena-xxx@vx.x.x"`
6. Make tag : `git tag athena-xxx@vx.x.x`
7. Publish changelog & tag : `git push && git push origin athena-xxx@vx.x.x`
8. Publish package to the npm : `yarn publish --access public`
9. Merge it into master : `git checkout master && git merge && git push`
