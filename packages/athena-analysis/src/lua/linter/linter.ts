import logger from 'loglevel';
import { Linter } from '../../api';
import { Lint, LintKind, LuaAnalysisInfo } from '../../model';

export default class LuaLinter implements Linter {
  
  public async lint(analysisInfos: any) {
    logger.debug("Generate lint with", analysisInfos);
    return this.extractLints(analysisInfos)
  }

  protected extractLints(analyzeInfos: LuaAnalysisInfo[]) {
    logger.debug("Extract lints from", analyzeInfos);

    return analyzeInfos.filter((a, i) => (analyzeInfos.length - 1) == i)
      .filter(a => null != a.err)
      .map(a => this.resolveParsingError(a));
  }

  protected resolveParsingError(analysisInfo: LuaAnalysisInfo) {
    const err = analysisInfo.err;
    logger.debug("Resolve parsing error to lint", err);

    const index = err.index;
    const message = err.message;
    const kind = LintKind.Error;
    return new Lint(index, message, kind);
  }

}