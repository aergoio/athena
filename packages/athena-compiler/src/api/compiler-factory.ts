import { CompilerType } from "../model";
import { LuaCompiler } from "../lua";
import { AsclCompiler } from "../ascl";
import { Compiler } from './compiler';

export class CompilerFactory {

  public create(type: CompilerType): Compiler {
    switch (type) {
      case CompilerType.Lua:
        return new LuaCompiler();
      case CompilerType.Ascl:
        return new AsclCompiler();
    }
  }

}

export default CompilerFactory;