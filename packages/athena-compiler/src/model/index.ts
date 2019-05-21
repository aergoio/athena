export interface CompileResult {
  payload: string;
  abi: any;
}

export enum CompilerType {
  Lua,
  Ascl
};