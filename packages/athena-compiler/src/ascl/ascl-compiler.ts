import Compiler from "../api/compiler";
import { CompileResult } from "../model";

export default class Asclompiler implements Compiler {

  public async compile(source: string, absolutePath: string): Promise<CompileResult> {
    // TODO : not yet implemented
    return new CompileResult("", "");
  }

}