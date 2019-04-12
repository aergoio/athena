export enum SuggestionKind {
  Unknown,
  Variable,
  Function,
  Table,
  Member,
  System
}

export class Suggestion {
  name: string;
  snippet: string;
  type: string;
  kind: SuggestionKind;

  constructor(name: string, snippet: string, type: string, kind: SuggestionKind) {
    this.name = name;
    this.snippet = snippet;
    this.type = type;
    this.kind = kind;
  }

}

export default Suggestion;