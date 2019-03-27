import fs from 'fs';
import os from 'os';
import child_process from 'child_process';
import logger from 'loglevel'

import Compiler from "../api/compiler";
import { CompileResult } from "../model";
import LuaDependencyResolver from './dependency-resolver';

const LUA_COMPILER_OSX = "aergoluac_osx";
const LUA_COMPILER_LINUX = "aergoluac_linux";
const LUA_COMPILER_WINDOW = "aergoluac_window";

const LUA_ABI_TEMP_FILE = "temp_athena_ide_atom.abi";
const LUA_BC_TEMP_FILE = "temp_athena_ide_atom.bc";
const LUA_TEMP_FILE = "temp_athena_ide_atom.lua";

export default class LuaCompiler implements Compiler {

  readonly dependencyResolver: LuaDependencyResolver = new LuaDependencyResolver();

  public async compile(source: string, absolutePath: string): Promise<CompileResult> {
    logger.debug("Compile", absolutePath);
    logger.debug(source);
    const dependencyResolved = await this.dependencyResolver.resolveDependency(source, absolutePath);
    const tempSourceFile = this.saveToTempFile(dependencyResolved);

    const compiler = this.getCompilerPath();
    const payloadResult = child_process.spawnSync(compiler, ["--payload", tempSourceFile]);
    logger.debug("Payload result", payloadResult);
    if (this.isSpanFail(payloadResult)) {
      throw new Error(payloadResult.stderr.toString());
    }

    const abiTempFile = this.getAbiTempPath()
    const bcTempFile = this.getBcTempPath();
    const abiResult = child_process.spawnSync(compiler, ["--abi", abiTempFile, tempSourceFile, bcTempFile]);
    logger.debug("Abi result", abiResult);
    if (this.isSpanFail(abiResult)) {
      throw new Error(abiResult.stderr.toString());
    }

    const payload = payloadResult.stdout.toString();
    const jsonAbi = JSON.parse(this.readFile(abiTempFile));
    const abi = JSON.stringify(jsonAbi, null, 2);

    return new CompileResult(abi, payload);
  }

  protected saveToTempFile(source: string): string {
    const absPath = os.tmpdir() + "/" + LUA_TEMP_FILE;
    fs.writeFileSync(absPath, source)
    return absPath;
  }

  protected getCompilerPath(): string {
    let compiler = __dirname + "/res/";
    if ('darwin' === os.platform()) {
      compiler = compiler + LUA_COMPILER_OSX;
    } else if ('linux' === os.platform()) {
      compiler = compiler + LUA_COMPILER_LINUX;
    } else if ('win32' === os.platform()) {
      compiler = compiler + LUA_COMPILER_WINDOW;
    } else {
      throw "UnSupported os type";
    }
    return compiler;
  }

  protected getAbiTempPath(): string {
    return os.tmpdir() + "/" + LUA_ABI_TEMP_FILE;
  }

  protected getBcTempPath(): string {
    return os.tmpdir() + "/" + LUA_BC_TEMP_FILE;
  }

  protected isSpanFail(spanResult: any): boolean {
    return (0 !== spanResult.status) || (0 !== spanResult.stderr.length);
  }

  protected readFile(path: string): string {
    return fs.readFileSync(path, "utf8");
  }

}