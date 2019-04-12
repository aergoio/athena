import LuaSymbolTable from './symbol-table';
import LuaTableFieldTree from './table-field-tree';

export default class LuaAnalysisInfo {
  file: string;
  symbolTable: LuaSymbolTable;
  tableFieldTree: LuaTableFieldTree;
  err: any;

  constructor(file: string, symbolTable: LuaSymbolTable, tableFieldTree: LuaTableFieldTree, err: any) {
    this.file = file;
    this.symbolTable = symbolTable;
    this.tableFieldTree = tableFieldTree;
    this.err = err;
  }

}