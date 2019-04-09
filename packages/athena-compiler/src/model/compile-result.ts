export default class CompileResult {
  readonly payload: string;
  readonly abi: string;

  constructor(payload: string, abi: string) {
    this.payload = payload;
    this.abi = abi;
  }
}