export enum SuggestionKind {
  Unknown,
  Snippet,
  Variable,
  Function,
  Table,
  Member,
  System
}

export class Suggestion {
  prefix: string;
  snippet: string;
  type: string;
  kind: SuggestionKind;

  constructor(prefix: string, snippet: string, type: string, kind: SuggestionKind) {
    this.prefix = prefix;
    this.snippet = snippet;
    this.type = type;
    this.kind = kind;
  }

}

export default Suggestion;