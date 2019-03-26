export default class LuaSuggestion {
  name: string;
  type: string;
  kind: string;
  snippet: string;

  constructor(name: string, type: string, kind: string, snippet: string) {
    this.name = name;
    this.type = type;
    this.kind = kind;
    this.snippet = snippet;
  }

}
