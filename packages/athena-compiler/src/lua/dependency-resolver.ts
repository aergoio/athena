import path from 'path';
import os from 'os';
import fs from 'fs';

import logger from 'loglevel';

export default class LuaDependencyResolver {

  /**
   * Resolve lua source with `import` statements.
   *
   * @param source a lua source string
   * @param absolutePath an absolute path of source
   *
   * @returns {Promise<string>} a dependency resolved lua source
   */
  public async resolveDependency(source: string, absolutePath: string): Promise<string> {
    return this.resolveImport(source, absolutePath)
      .map(f => this.readFile(f))
      .map(s => this.getImportTrimmed(s))
      .join("\n");
  }

  protected resolveImport(source: string, absolutePath: string): Array<string> {
    return [
      ...this.extractImportStatement(source).map(i => this.resolveImportTargetPath(i, absolutePath)),
      absolutePath
    ];
  };

  protected extractImportStatement(source: string): Array<string> {
    const importStatements = [];
    let startIndex = 0;
    while (startIndex < source.length) {
      const nextLineInfo = this.nextLine(source, startIndex);
      const nextLine = nextLineInfo.line;
      startIndex = nextLineInfo.endIndex + 1;
      if (!this.isImportStatement(nextLine)) {
        break;
      }
      importStatements.push(this.trimImportStatement(nextLine));
    }
    return importStatements;
  };

  protected trimImportStatement(rawImportStatement: string) {
    const splited = rawImportStatement.trim().split(/\s+/);
    const importTarget = splited[1].substring(1, splited[1].length - 1);
    return "import "  + "\"" + importTarget + "\"";
  }

  protected getImportTrimmed(source: string): string {
    let startIndex = 0;
    while (startIndex < source.length) {
      const nextLineInfo = this.nextLine(source, startIndex);
      const nextLine = nextLineInfo.line;
      if (!this.isImportStatement(nextLine)) {
        break;
      }
      startIndex = nextLineInfo.endIndex + 1;
    }
    return source.substring(startIndex);
  }

  protected nextLine(source: string, startIndex: number): any {
    let endIndex = startIndex;
    while (endIndex < source.length && source[endIndex] != '\n') {
      ++endIndex;
    }
    let line = source.substring(startIndex, endIndex + 1);
    return {line: line, endIndex: endIndex};
  }

  protected isImportStatement(line: string) {
    return line.indexOf("import") !== -1;
  }

  protected resolveImportTargetPath(importStatement: string, baseFile: string): string {
    const splited = importStatement.trim().split(/\s+/);
    const importTarget = splited[1].substring(1, splited[1].length - 1);
    logger.debug("Splited import statement:", splited);

    let importPath = "";
    if (this.isRelativeImport(importTarget)) {
      importPath = os.homedir + "/.aergo_modules/" + importTarget;
      const aergoJson = this.getPackageInfo(importPath);
      importPath = importPath + "/" + aergoJson.target;
    } else { // package import
      importPath = path.resolve(path.dirname(baseFile), importTarget);
    }
    return importPath;
  }

  protected isRelativeImport(importTarget: string) {
    return importTarget[0] !== ".";
  }

  protected getPackageInfo(packagePath: string) {
    const aergoJsonPath = packagePath + "/aergo.json";
    const rawAergoJson = this.readFile(aergoJsonPath);
    const aergoJson = JSON.parse(rawAergoJson)
    logger.debug("Package info", aergoJsonPath, aergoJson);
    return aergoJson;
  }

  protected readFile(filePath: string) {
    return fs.readFileSync(filePath, "utf8");
  }

}