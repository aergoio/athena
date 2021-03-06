import logger from 'loglevel';

import { Suggester } from '../../api';
import { LuaAnalyzer } from '../analyzer';
import { Suggestion, SuggestionKind, LuaSymbolTable, LuaTableFieldTree, luaTypes, LuaAnalysisInfo } from '../../model';
import { contains } from '../../utils';

import aergoSymbols from './res/aergo-symbols.json';
import aergoTableTree from './res/aergo-table-tree.json';
import luaSnippets from './res/lua-snippets.json';

export default class LuaSuggester implements Suggester {

  protected analyzer: LuaAnalyzer;
  protected aergoSymbolTable: LuaSymbolTable;
  protected aergoTableFieldTree: LuaTableFieldTree;
  protected luaSnippets: Suggestion[];

  public constructor() {
    this.analyzer = new LuaAnalyzer();

    this.aergoSymbolTable = new LuaSymbolTable(aergoSymbols);
    this.aergoTableFieldTree = new LuaTableFieldTree(aergoTableTree);
    this.luaSnippets = luaSnippets.map(s => new Suggestion(s.prefix, s.snippet, "snippet", SuggestionKind.Snippet));
  }

  public async suggest(analysis: any, prefix: string, index: number): Promise<Suggestion[]> {
    logger.debug("Resolve suggestion with", analysis, index, prefix);
    return this.getSuggestions(analysis, prefix, index);
  }

  protected getSuggestions(analyzeInfos: LuaAnalysisInfo[], prefix: string, index: number): Suggestion[] {
    logger.debug("Suggestions with", analyzeInfos);
    const prefixChain = prefix.split(".");
    logger.debug("Prefix chain", prefixChain);

    let suggestions: Suggestion[] = [];
    if (1 === prefixChain.length) {
      const symbolTables = analyzeInfos.map(a => a.symbolTable);
      symbolTables.unshift(this.aergoSymbolTable);
      suggestions = this.findSuggestionFromSymbolTables(symbolTables, prefixChain[0], index);
    } else {
      const tableFieldTrees = analyzeInfos.map(a => a.tableFieldTree);
      tableFieldTrees.unshift(this.aergoTableFieldTree);
      suggestions = this.findSuggestionFromTableFields(tableFieldTrees, prefixChain);
    }

    return suggestions;
  }

  protected findSuggestionFromSymbolTables(symbolTables: LuaSymbolTable[], prefix: string, index: number): Suggestion[] {
    logger.debug("Visit table with index", index);
    logger.debug(symbolTables);
    let suggestions: Suggestion[] = [];

    // search for symbol tables
    symbolTables.forEach((symbolTable, i) => {
      if (i === (symbolTables.length - 1)) {
        const subSuggestions = this.findSuggestionRecursively(symbolTable, prefix, index);
        suggestions = suggestions.concat(subSuggestions);
      } else {
        Object.keys(symbolTable.entries).forEach((name) => {
          const entry = symbolTable.entries[name]
          if (contains(name, prefix)) {
            const kind = this.resolveKind(entry.type);
            suggestions.push(new Suggestion(name, entry.snippet, entry.type, kind));
          }
        });
      }
    });

    // search for lua snippets
    this.luaSnippets.forEach(snippet => {
      if (contains(snippet.prefix, prefix)) {
        suggestions.push(snippet);
      }
    });

    return suggestions;
  }

  protected findSuggestionRecursively(symbolTable: LuaSymbolTable, prefix: string, index: number): Suggestion[] {
    let suggestions: Suggestion[] = [];

    if (symbolTable.isInScope(index)) {
      Object.keys(symbolTable.entries).forEach((name) => {
        const entry = symbolTable.entries[name]
        if (entry.index < index && contains(name, prefix)) {
          const kind = this.resolveKind(entry.type);
          suggestions.push(new Suggestion(name, entry.snippet, entry.type, kind));
        }
      });
      symbolTable.children.forEach(child => {
        suggestions = suggestions.concat(this.findSuggestionRecursively(child, prefix, index));
      });
    }

    return suggestions;
  }

  protected findSuggestionFromTableFields(tableFieldTrees: LuaTableFieldTree[], prefixChain: string[]): Suggestion[] {
    if (prefixChain.length <= 1) {
      logger.error("prefixchain length must be longer than 1");
      return [];
    }

    let usedSet = new Set<string>();
    let suggestions: Suggestion[] = [];

    const name = prefixChain[prefixChain.length - 1];
    tableFieldTrees.forEach(tableFieldTree => {
      tableFieldTree.find(prefixChain).forEach(tableField => {
        const suggestion = new Suggestion(name, tableField.snippet, tableField.type, SuggestionKind.Member);
        const key = JSON.stringify(suggestion);
        if (!usedSet.has(key)) {
          suggestions.push(suggestion);
          usedSet.add(key);
        }
      });
    });

    return suggestions;
  }

  protected resolveKind(luaType: string): SuggestionKind {
    if (null == luaType) {
      return SuggestionKind.Unknown;
    }
    switch (luaType) {
      case luaTypes.LUA_TYPE_UNKNOWN:
      case luaTypes.LUA_TYPE_STRING:
      case luaTypes.LUA_TYPE_NUMERIC:
      case luaTypes.LUA_TYPE_BOOLEAN:
      case luaTypes.LUA_TYPE_NIL:
      case luaTypes.LUA_TYPE_VARARG:
      case luaTypes.LUA_TYPE_TABLE:
        return SuggestionKind.Variable;
      case luaTypes.LUA_TYPE_FUNCTION:
        return SuggestionKind.Function
      case luaTypes.LUA_TYPE_TABLE_MEMBER:
        return SuggestionKind.Member;
      case luaTypes.LUA_TYPE_SYSTEM:
        return SuggestionKind.System;
     default:
        return SuggestionKind.Unknown;
    }
  }

}