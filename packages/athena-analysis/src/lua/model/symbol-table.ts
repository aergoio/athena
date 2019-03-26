import { stringify } from "querystring";

export class LuaSymbolEntry {
  index: number;
  type: string;
  kind: string;
  snippet: string;

  constructor(index: number, type: string, kind: string, snippet: string) {
    this.index = index;
    this.type = type;
    this.kind = kind;
    this.snippet = snippet;
  }

}

export class Range {
  start: number;
  end: number;

  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
  }

}

export class LuaSymbolTable {

  static empty: LuaSymbolTable = new LuaSymbolTable("", undefined);

  fileName: string;
  range: Range;
  entries: any;
  parent: LuaSymbolTable;
  children: Array<LuaSymbolTable>;

  static create(fileName: string, entries: any) {
    return new LuaSymbolTable(fileName, entries);
  }

  constructor(fileName: string, entries?: any) {
    this.fileName = fileName;
    this.range = new Range(0, Infinity);
    this.entries = typeof entries === "undefined" ? {} : entries;
    this.parent = LuaSymbolTable.empty;
    this.children = [];
  }

  isRoot() {
    return LuaSymbolTable.empty === this.parent;
  }

  getParent() {
    return this.parent;
  }

  isInScope(index: number) {
    return this.range.start <= index && index <= this.range.end;
  }

  setStart(start: number) {
    this.range.start = start;
  }

  setEnd(end: number) {
    this.range.end = end;
  }

  addEntry(identifier: string, index: number, type: string, kind: string, snippet: string) {
    if (!this.entries.hasOwnProperty(identifier)) {
      this.entries[identifier] = new LuaSymbolEntry(index, type, kind, snippet);
    }
  }

  setParent(parent: LuaSymbolTable) {
    this.parent = parent;
  }

  addChild(child: LuaSymbolTable) {
    this.children.push(child);
  }

}

export default LuaSymbolTable;