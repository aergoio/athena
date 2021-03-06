import logger from 'loglevel';

import {LuaAnalysisInfo} from '../../model';

import LuaParser from './parser';
import LuaSymbolTableGenerator from './symbol-table-generator';
import LuaTableFieldTreeGenerator from './table-field-tree-generator';

export default class LuaAnalysisGenerator {

  generate(source: string, fileName: string): LuaAnalysisInfo {
    logger.debug("Generate parse result for", fileName);
    logger.debug(source);
    const luaParser = new LuaParser();
    const symbolTableGenerator = new LuaSymbolTableGenerator();
    const tableFieldTreeGenerator = new LuaTableFieldTreeGenerator();
    const parseResult = luaParser.parse(source, symbolTableGenerator, tableFieldTreeGenerator);
    logger.debug("Parse result", parseResult);

    const file = fileName;
    const symbolTables = symbolTableGenerator.getGenerated();
    const tableFieldTrees = tableFieldTreeGenerator.getGenerated();
    const err = parseResult.err;
    return new LuaAnalysisInfo(file, symbolTables, tableFieldTrees, err);
  }

}