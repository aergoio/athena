import * as luaTypes from './lua-types';

export class LuaTableField {
  type: string;
  snippet: string;

  constructor(type: string, snippet: string) {
    this.type = type;
    this.snippet = snippet;
  }

}

export class LuaTableFieldTree {
  protected root: any;

  constructor(entries?: any) {
    this.root = typeof entries === "undefined" ? {} : entries;
  }

  public addFieldValue(fieldChain: string[], type: string, snippet: string): void {
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
    currField.__possibleValues.push(new LuaTableField(type, snippet));
  }

  public find(prefixChain: string[]): LuaTableField[] {
    const ret: LuaTableField[] = [];

    let index = 0;
    let currEntry = this.root;

    // find field chain step by step
    while (index < prefixChain.length - 1 && null != currEntry) {
      const prefix = prefixChain[index];
      if (!currEntry.hasOwnProperty(prefix)) {
        currEntry = null;
        break;
      }
      currEntry = currEntry[prefix]
      ++index;
    }

    // find possible values
    if (null != currEntry) {
      const lastPrefix = prefixChain[index];
      Object.keys(currEntry)
        .filter(field => field !== "__possibleValues")
        .forEach(field => {
          if (field.toLowerCase().indexOf(lastPrefix) === 0) {
            const possibleFields: LuaTableField[] = currEntry[field].__possibleValues;
            if (typeof possibleFields !== "undefined") {
              possibleFields.forEach(field => ret.push(field));
            } else {
              // final one is a table
              ret.push(new LuaTableField(luaTypes.LUA_TYPE_TABLE, field))
            }
          }
        });
    }

    return ret;
  }
}

export default LuaTableFieldTree;