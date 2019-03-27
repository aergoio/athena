export default class CompileResult {
  readonly abi: string;
  readonly payload: string;

  constructor(abi: string, payload: string) {
    this.abi = abi;
    this.payload = payload;
  }
}