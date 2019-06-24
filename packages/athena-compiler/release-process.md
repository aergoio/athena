# Release process

1. Update version of package.json && README.md and CHANGELOG.md
2. `rm -rf ./dist ./node_modules && yarn install && yarn run build`
3. `git add . && git commit -m "Prepare for athena-compiler@vx.x.x" && git push"`
4. `git tag athena-compiler@vx.x.x && git push origin athena-compiler@vx.x.x`
5. `yarn publish --access public`
6. `git checkout master && git merge develop/athena-compiler`
