import os from 'os';

import bs58check from 'bs58check';
import ffi from 'ffi';
import ref from 'ref';
import ArrayType from 'ref-array';
import StructType from 'ref-struct';
import logger from 'loglevel'

import Compiler from "../api/compiler";
import { CompileResult } from "../model";
import LuaDependencyResolver from './dependency-resolver';
import { numberToByteArray as numberToLittleEndianByteArray } from '../util/endian';

const COMPILER_LIB_WINDOW = "libcompiler_window";
const COMPILER_LIB_OSX = "libcompiler_osx";

const LUA_CODE_VERSION = 0xC0;

const compile_result = StructType({
  bc_ptr: ArrayType(ref.types.byte),
  bc_len: ref.types.int,
  abi_ptr: ArrayType(ref.types.byte),
  abi_len: ref.types.int
});

export default class LuaNativeCompiler implements Compiler {

  readonly dependencyResolver: LuaDependencyResolver = new LuaDependencyResolver();
  libCompiler: any;

  constructor() {
    // c types
    const lua_State = ref.types.void;
    const lua_State_ptr = ref.refType(lua_State);
    const compile_result_ptr = ref.refType(compile_result);

    this.libCompiler = ffi.Library(this.getCompilerLib(), {
      'luac_vm_newstate': [ lua_State_ptr, []],
      'luac_vm_close': [ 'void', [ lua_State_ptr ]],
      'vm_loadstring': [ 'string', [ lua_State_ptr, 'string' ]],
      'vm_stringdump': [ 'string', [ lua_State_ptr, compile_result_ptr ]]
    });
  }

  public async compile(source: string, absolutePath: string): Promise<CompileResult> {
    logger.debug("Compile", absolutePath);
    logger.debug(source);
    const dependencyResolved = await this.dependencyResolver.resolveDependency(source, absolutePath);

    // open the vm
    const lua_State_ptr = this.libCompiler.luac_vm_newstate();
  
    // load lua source code
    const loadRet = this.libCompiler.vm_loadstring(lua_State_ptr, dependencyResolved);
    if (null !== loadRet) {
      this.libCompiler.luac_vm_close(lua_State_ptr);
      throw loadRet;
    }

    // dump bytecode, abi
    let result = new compile_result();
    const dumpRet  = this.libCompiler.vm_stringdump(lua_State_ptr, result.ref());
    if (null !== dumpRet) {
      this.libCompiler.luac_vm_close(lua_State_ptr);
      throw dumpRet;
    }

    const bytecode = ref.reinterpret(result.bc_ptr.buffer, result.bc_len);
    const abi = ref.reinterpret(result.abi_ptr.buffer, result.abi_len);
    const abiInStr = JSON.stringify(JSON.parse(abi.toString()), null, 2);
    const payload = this.genPayload(bytecode, abi);

    this.libCompiler.luac_vm_close(lua_State_ptr);

    return new CompileResult(payload, abiInStr);
  }

  protected genPayload(bytecode: Buffer, abi: Buffer): string {
    // version + bytecode.length(4byte) + bytecode + abi
    const versionCapacity = 1;
    const bcLenCapacity = 4;
    const bcLen = bytecode.length;
    const abiLen = abi.length;

    const rawPayload = new Uint8Array(versionCapacity + bcLenCapacity + bcLen + abiLen);

    let index = 0;

    // append version
    rawPayload[index++] = LUA_CODE_VERSION;

    // append byte code len in little endian
    numberToLittleEndianByteArray(bcLen).forEach(v => {
      rawPayload[index++] = v
    });

    // append byte code
    bytecode.forEach(v => {
      rawPayload[index++] = v
    });

    // append abi
    abi.forEach(v => {
      rawPayload[index++] = v
    });

    return bs58check.encode(Buffer.from(rawPayload.buffer));
  }

  protected getCompilerLib(): string {
    let compilerLib = __dirname + "/res/";
    if ('darwin' === os.platform()) {
      compilerLib = compilerLib + COMPILER_LIB_OSX;
    } else if ('linux' === os.platform()) {
      // TODO
    } else if ('win32' === os.platform()) {
      compilerLib = compilerLib + COMPILER_LIB_WINDOW
    } else {
      throw "UnSupported os type";
    }
    return compilerLib;
  }

}