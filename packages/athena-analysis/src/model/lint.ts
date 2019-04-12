export enum LintKind {
  Warn,
  Error
}

export class Lint {
  index: number;
  message: string;
  kind: LintKind;

  constructor(index: number, message: string, kind: LintKind) {
    this.index = index;
    this.message = message;
    this.kind = kind;
  }

}

export default Lint;