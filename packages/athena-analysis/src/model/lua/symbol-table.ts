export class LuaSymbol {
  index: number;
  type: string;
  snippet: string;

  constructor(index: number, type: string, snippet: string) {
    this.index = index;
    this.type = type;
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

  public static empty: LuaSymbolTable = new LuaSymbolTable();

  range: Range;
  entries: any;
  parent: LuaSymbolTable;
  children: LuaSymbolTable[];

  constructor(entries?: any) {
    this.range = new Range(0, Infinity);
    this.entries = typeof entries === "undefined" ? {} : entries;
    this.parent = LuaSymbolTable.empty;
    this.children = [];
  }

  public isRoot(): boolean {
    return LuaSymbolTable.empty === this.parent;
  }

  public getParent(): LuaSymbolTable {
    return this.parent;
  }

  public isInScope(index: number): boolean {
    return this.range.start <= index && index <= this.range.end;
  }

  public setStart(start: number): void {
    this.range.start = start;
  }

  public setEnd(end: number): void {
    this.range.end = end;
  }

  public addEntry(identifier: string, index: number, type: string, snippet: string): void {
    if (!this.entries.hasOwnProperty(identifier)) {
      this.entries[identifier] = new LuaSymbol(index, type, snippet);
    }
  }

  public setParent(parent: LuaSymbolTable): void {
    this.parent = parent;
  }

  public addChild(child: LuaSymbolTable): void {
    this.children.push(child);
  }

}

export default LuaSymbolTable;