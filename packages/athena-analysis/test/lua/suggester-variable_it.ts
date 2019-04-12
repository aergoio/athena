import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';
chai.use(chaiAsPromised);
const assert = chai.assert;

import { LuaAnalyzer, LuaSuggester } from '../../src/lua';
import { SuggestionKind } from '../../src/model';

describe("Suggestion for plain variable, function", () => {

  const filePath = __dirname + "/resources/variablefunction.lua";
  const source = fs.readFileSync(filePath, "utf8");
  const luaAnalyzer = new LuaAnalyzer();
  const luaSuggester = new LuaSuggester();

  describe("Suggestion in global after variable1, variable2, variable3 (line: 7)", () => {

    const index = 77;

    it("variable", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "variable", index);
      assert.equal(suggestions.length, 3);
      assert.equal(suggestions.filter(s => SuggestionKind.Variable === s.kind).length, 3);
    });

  });

  describe("Suggestion in named function with argument (line: 15)", () => {

    const index = 172;

    it("variable", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "variable", index);
      assert.equal(suggestions.length, 4);
      assert.equal(suggestions.filter(s => SuggestionKind.Variable === s.kind).length, 4);
    });

    it("arg", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "arg", index);
      assert.equal(suggestions.length, 2);
      assert.equal(suggestions.filter(s => SuggestionKind.Variable === s.kind).length, 2);
    });

    it("func", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "func", index);
      assert.equal(suggestions.length, 2);
      assert.equal(suggestions.filter(s => SuggestionKind.Function === s.kind).length, 2);
    });

  });

  describe("Suggestion in global after func1 (line: 23)", () => {

    const index = 358;

    it("variable", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "variable", index);
      assert.equal(suggestions.length, 3);
      assert.equal(suggestions.filter(s => SuggestionKind.Variable === s.kind).length, 3);
    });

    it("func", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "func", index);
      assert.equal(suggestions.length, 2);
      assert.equal(suggestions.filter(s => SuggestionKind.Function === s.kind).length, 2);
    });

  });

  describe("Suggestion in assigned anonymous function (line: 29)", () => {

    const index = 499;

    it("variable", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "variable", index);
      assert.equal(suggestions.length, 4);
      assert.equal(suggestions.filter(s => SuggestionKind.Variable === s.kind).length, 4);
    });

    it("arg", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "arg", index);
      assert.equal(suggestions.length, 2);
      assert.equal(suggestions.filter(s => SuggestionKind.Variable === s.kind).length, 2);
    });

    it("func", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "func", index);
      assert.equal(suggestions.length, 3);
      assert.equal(suggestions.filter(s => SuggestionKind.Function === s.kind).length, 3);
    });

  });

  describe("Suggestion in global after func2 (line: 40)", () => {

    const index = 704;

    it("variable", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "variable", index);
      assert.equal(suggestions.length, 4);
      assert.equal(suggestions.filter(s => SuggestionKind.Variable === s.kind).length, 4);
    });

    it("func", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "func", index);
      assert.equal(suggestions.length, 3);
      assert.equal(suggestions.filter(s => SuggestionKind.Function === s.kind).length, 3);
    });

  });

  describe("Suggestion in named function without argument (line: 45)", () => {

    const index = 832;

    it("variable", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "variable", index);
      assert.equal(suggestions.length, 4);
      assert.equal(suggestions.filter(s => SuggestionKind.Variable === s.kind).length, 4);
    });

    it("arg", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "arg", index);
      assert.equal(suggestions.length, 0);
      assert.equal(suggestions.filter(s => SuggestionKind.Variable === s.kind).length, 0);
    });

    it("func", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "func", index);
      assert.equal(suggestions.length, 3);
      assert.equal(suggestions.filter(s => SuggestionKind.Function === s.kind).length, 3);
    });

  });

  describe("Suggestion in global after func3 (line: 56)", () => {

    const index = 1019;

    it("variable", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "variable", index);
      assert.equal(suggestions.length, 4);
      assert.equal(suggestions.filter(s => SuggestionKind.Variable === s.kind).length, 4);
    });

    it("func", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "func", index);
      assert.equal(suggestions.length, 3);
      assert.equal(suggestions.filter(s => SuggestionKind.Function === s.kind).length, 3);
    });

  });

  describe("Suggestion for imported one (line: 60)", () => {

    const index = 1128;

    it("library", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "library", index);
      assert.equal(suggestions.length, 3);
      assert.equal(suggestions.filter(s => SuggestionKind.Variable === s.kind).length, 2);
      assert.equal(suggestions.filter(s => SuggestionKind.Function === s.kind).length, 1);
    });
  });

});