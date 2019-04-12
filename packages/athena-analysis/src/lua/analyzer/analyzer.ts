import logger from 'loglevel';

import { Analyzer } from '../../api';
import { LuaAnalysisInfo } from '../../model';

import LuaImportResolver from './import-resolver';
import LuaAnalysisGenerator from './analysis-generator';

export default class LuaAnalyzer implements Analyzer {
  importResolver: LuaImportResolver;
  analysisGenerator: LuaAnalysisGenerator;

  constructor() {
    this.importResolver = new LuaImportResolver();
    this.analysisGenerator = new LuaAnalysisGenerator();
  }

  async analyze(source: string, filePath: string): Promise<LuaAnalysisInfo[]> {
    logger.debug("Analyze", filePath);
    logger.debug(source);
    const analysisInfos = [];
    const importStatements = this.importResolver.extractImportStatements(source);
    importStatements.forEach(importStatement => {
      analysisInfos.push(this.importResolver.getAnalysisInfosOf(importStatement, filePath));
    });
    analysisInfos.push(this.analysisGenerator.generate(source, filePath));
    return analysisInfos;
  }

}