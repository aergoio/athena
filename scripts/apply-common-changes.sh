#!/bin/bash -e

# Resolve script home
SOURCE="${BASH_SOURCE[0]}"
# resolve $SOURCE until the file is no longer a symlink
while [ -h "$SOURCE" ]; do
  SCRIPT_HOME="$( cd -P "$( dirname "$SOURCE" )" >/dev/null && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
  [[ $SOURCE != /* ]] && SOURCE="$SCRIPT_HOME/$SOURCE"
done
readonly SCRIPT_HOME="$( cd -P "$( dirname "$SOURCE" )" >/dev/null && pwd )"

readonly BASE_BRANCH="master"
readonly BRANCH_PREFIX="develop"
readonly MODULES=(
  "$BRANCH_PREFIX/analysis"
  "$BRANCH_PREFIX/client"
  "$BRANCH_PREFIX/compiler"
  "$BRANCH_PREFIX/webpack-loader"
)

# make sure current is master
readonly CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
[ ${CURRENT_BRANCH} != ${BASE_BRANCH} ] && echo "Current branch must be $BASE_BRANCH" && exit -1

# commit
cd "$SCRIPT_HOME/.."
git add .
git commit

# cherry-pick to all the modules
readonly GIT_HASH=$(git rev-parse HEAD)
for module in ${MODULES[@]}; do
  git checkout ${module}
  git cherry-pick ${GIT_HASH}
done

# get back to base branch
git checkout ${BASE_BRANCH}

