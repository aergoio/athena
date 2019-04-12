import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';
chai.use(chaiAsPromised);
const assert = chai.assert;

import { LuaAnalyzer, LuaLinter } from '../../src/lua';
import { luaTypes } from '../../src/model';

describe("Linter integration test", () => {

  const luaAnalyzer = new LuaAnalyzer();
  const luaLinter = new LuaLinter();

  describe("Syntax check", () => {
    const filePath = __dirname + "/resources/syntaxerror.lua";
    const source = fs.readFileSync(filePath, "utf8");

    it("Linter for syntax error", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const lints = await luaLinter.lint(analysisInfos);
      assert.equal(lints.length, 1);
    });

  });

});