import logger from 'loglevel';

import { LuaSymbolTable, luaTypes } from '../../model';

import Visitor from './visitor';
import { buildFuncSnippet } from './utils';
import * as luaparseType from './luaparse-types';

export default class LuaSymbolTableGenerator implements Visitor {

  protected symbolTable: LuaSymbolTable;

  constructor() {
    this.symbolTable = LuaSymbolTable.empty;
  }

  public getGenerated() {
    // if parsing error, symbol table isn't referencing root table
    while (!this.symbolTable.isRoot()) {
      this.symbolTable = this.symbolTable.getParent();
    }
    logger.debug("Generated symbol table", this.symbolTable);
    return this.symbolTable;
  }

  public onCreateNode(node: any) {
    const nodeType = node.type;
    // globalVariable = ...
    // local localVariable = ...
    if (luaparseType.LUAPARSE_ASSIGNMENT_STATEMENT === nodeType ||
        luaparseType.LUAPARSE_LOCAL_STATEMENT === nodeType) {
      this.parseVariableAssignment(node);
    }
  }

  protected parseVariableAssignment(node: any) {
    // only parse assignment to identifier
    if (luaparseType.LUAPARSE_IDENTIFIER !== node.variables[0].type) {
      return;
    }

    const identifierName = node.variables[0].name;
    const index = this.parseStartIndex(node);
    const initType = node.init.length === 0 ? luaTypes.LUA_TYPE_UNKNOWN
      : luaparseType.resolveType(node.init[0].type);
    // variable = function (arg1, arg2) ...
    if (luaTypes.LUA_TYPE_FUNCTION === initType) {
      const parameters = node.init[0].parameters;
      const snippet = buildFuncSnippet(identifierName, parameters);
      this.symbolTable.addEntry(identifierName, index, initType, snippet);
    }
    // variable = "some_value"
    else {
      this.symbolTable.addEntry(identifierName, index, initType, identifierName);
    }
  }
  protected parseStartIndex(rangeHolder: any) {
    return rangeHolder.range[0];
  }

  public onCreateScope(scope: any) {
    if (LuaSymbolTable.empty == this.symbolTable) {
      this.symbolTable = new LuaSymbolTable();
    } else {
      const child = new LuaSymbolTable();
      child.setParent(this.symbolTable);
      this.symbolTable.addChild(child);
      this.symbolTable = child;
    }
    this.symbolTable.setStart(scope.index);
  }

  public onDestroyScope(scope: any) {
    const scopeEndIndex = this.symbolTable.isRoot() ? Infinity : scope.index;
    this.symbolTable.setEnd(scopeEndIndex);
    this.symbolTable = this.getParentOrItself(this.symbolTable);
  }

  public onLocalDeclaration(identifierName: string): void {}

  public onFunctionSignature(signature: any) {
    const parameters = signature.parameters;
    // only parse named function
    if (null != signature.identifier && luaparseType.LUAPARSE_IDENTIFIER === signature.identifier.type) {
      const name = signature.identifier.name;
      // add function symbol to the parent scope
      this.addFunctionDeclaration(this.getParentOrItself(this.symbolTable), name, parameters);
    }
    this.addFunctionParameters(this.symbolTable, parameters);
  }

  protected addFunctionDeclaration(symbolTable: LuaSymbolTable, name: string, parameters: any[]) {
    // function should be accessable in other function (index = 0)
    // it's not an normal lua behavior. just an aergo smart contract behavior
    const type = luaTypes.LUA_TYPE_FUNCTION;
    const snippet = buildFuncSnippet(name, parameters);
    symbolTable.addEntry(name, 0, type, snippet);
  }

  protected addFunctionParameters(symbolTable: LuaSymbolTable, parameters: any[]) {
    parameters.forEach(parameter => {
      const name = parameter.name;
      const index = this.parseStartIndex(parameter);
      const type = luaTypes.LUA_TYPE_UNKNOWN;
      symbolTable.addEntry(name, index, type, name);
    });
  }

  protected getParentOrItself(symbolTable: LuaSymbolTable) {
    return symbolTable.isRoot() ? symbolTable : symbolTable.getParent();
  }

}