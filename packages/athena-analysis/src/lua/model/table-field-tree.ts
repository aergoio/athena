import logger from 'loglevel';
import * as luaTypes from './types';

export class LuaTableFieldValue {
  type: string;
  kind: string;
  snippet: string;

  constructor(type: string, kind: string, snippet: string) {
    this.type = type;
    this.kind = kind;
    this.snippet = snippet;
  }

}

export class LuaTableFieldTree {
  root: any;

  static create(entries: any) {
    return new LuaTableFieldTree(entries);
  }

  constructor(entries: any) {
    this.root = typeof entries === "undefined" ? {} : entries;
  }

  getRoot() {
    return this.root;
  }

  addFieldValue(fieldChain: Array<string>, type: string, snippet: string) {
    let currField = this.root;
    fieldChain.forEach(field => {
      if (!currField.hasOwnProperty(field)) {
        currField[field] = {};
      }
      currField = currField[field];
    });

    if (typeof currField.values === "undefined") {
      currField.__possibleValues = [];
    }
    currField.__possibleValues.push(new LuaTableFieldValue(type, luaTypes.LUA_KIND_TABLE_MEMBER, snippet));
  }

}

export default LuaTableFieldTree;