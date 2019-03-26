import logger from 'loglevel';
import {LuaLint, luaTypes, LuaAnalysisInfo} from '../model';
import {LuaAnalyzer} from '../analyzer';

export default class LuaLinter {
  analyzer: LuaAnalyzer;

  constructor() {
    this.analyzer = new LuaAnalyzer();
  }

  lint(source: string, filePath: string) {
    logger.debug("Generate lint", filePath);
    logger.debug(source);
    return this.analyzer.analyze(source, filePath).then((analysisInfos) =>
      this._extractLints(analysisInfos)
    );
  }

  _extractLints(analyzeInfos: Array<LuaAnalysisInfo>) {
    logger.debug("Extract lints from", analyzeInfos);

    return analyzeInfos.filter((a, i) => (analyzeInfos.length - 1) == i)
              .filter(a => null != a.err)
              .map(a => this._resolveParsingError(a));
  }

  _resolveParsingError(analysisInfo: LuaAnalysisInfo) {
    const err = analysisInfo.err;
    logger.debug("Resolve parsing error to lint", err);

    const type = luaTypes.LUA_LINT_TYPE_ERROR;
    const file = analysisInfo.file;
    const index = err.index;
    const message = err.message;
    return new LuaLint(type, file, index, message);
  }

}