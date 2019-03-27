import { CompileResult } from "../model";

export interface Compiler {

  /**
   * Compile source.
   *
   * @param source a lua source string
   * @param absolutePath an absolute path of source
   *
   * @returns {Promise<CompileResult>} a compile result
   */
  compile(source: string, absolutePath: string): Promise<CompileResult>;

}

export default Compiler;