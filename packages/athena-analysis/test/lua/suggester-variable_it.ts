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

  describe("Suggestion for imported one (line: 3)", () => {

    const index = 23;

    it("library", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "library", index);
      assert.equal(suggestions.length, 3);
      assert.equal(suggestions.filter(s => SuggestionKind.Variable === s.kind).length, 2);
      assert.equal(suggestions.filter(s => SuggestionKind.Function === s.kind).length, 1);
    });
  });

  describe("Suggestion in global after variable1, variable2, variable3 (line: 10)", () => {

    const index = 127;

    it("variable", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "variable", index);
      assert.equal(suggestions.length, 3);
      assert.equal(suggestions.filter(s => SuggestionKind.Variable === s.kind).length, 3);
    });

  });

  describe("Suggestion in named function with argument (line: 16)", () => {

    const index = 226;

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

    it("some", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "some", index);
      assert.equal(suggestions.length, 2);
      assert.equal(suggestions.filter(s => SuggestionKind.Function === s.kind).length, 2);
    });

  });

  describe("Suggestion in global after someFunc1 (line: 23)", () => {

    const index = 427;

    it("variable", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "variable", index);
      assert.equal(suggestions.length, 3);
      assert.equal(suggestions.filter(s => SuggestionKind.Variable === s.kind).length, 3);
    });

    it("some", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "some", index);
      assert.equal(suggestions.length, 2);
      assert.equal(suggestions.filter(s => SuggestionKind.Function === s.kind).length, 2);
    });

  });

  describe("Suggestion in assigned anonymous function (line: 30)", () => {

    const index = 585;

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

    it("some", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "some", index);
      assert.equal(suggestions.length, 3);
      assert.equal(suggestions.filter(s => SuggestionKind.Function === s.kind).length, 3);
    });

  });

  describe("Suggestion in global after someFunc2 (line: 37)", () => {

    const index = 809;

    it("variable", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "variable", index);
      assert.equal(suggestions.length, 4);
      assert.equal(suggestions.filter(s => SuggestionKind.Variable === s.kind).length, 4);
    });

    it("some", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "some", index);
      assert.equal(suggestions.length, 3);
      assert.equal(suggestions.filter(s => SuggestionKind.Function === s.kind).length, 3);
    });

  });

  describe("Suggestion in named function without argument (line: 43)", () => {

    const index = 958;

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

    it("some", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "some", index);
      assert.equal(suggestions.length, 3);
      assert.equal(suggestions.filter(s => SuggestionKind.Function === s.kind).length, 3);
    });

  });

  describe("Suggestion in global after someFunc3 (line: 50)", () => {

    const index = 1164;

    it("variable", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "variable", index);
      assert.equal(suggestions.length, 4);
      assert.equal(suggestions.filter(s => SuggestionKind.Variable === s.kind).length, 4);
    });

    it("some", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "some", index);
      assert.equal(suggestions.length, 3);
      assert.equal(suggestions.filter(s => SuggestionKind.Function === s.kind).length, 3);
    });

  });

  describe("Suggestion for mixed name (line: 56)", () => {

    const index = 1313;

    it("mix", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "mix", index);
      assert.equal(suggestions.length, 1);
      assert.equal(suggestions.filter(s => SuggestionKind.Variable === s.kind).length, 1);
    });

    it("mIx", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "mIx", index);
      assert.equal(suggestions.length, 1);
      assert.equal(suggestions.filter(s => SuggestionKind.Variable === s.kind).length, 1);
    });

    it("MIX", async () => {
      const analysisInfos = await luaAnalyzer.analyze(source, filePath);
      const suggestions = await luaSuggester.suggest(analysisInfos, "MIX", index);
      assert.equal(suggestions.length, 1);
      assert.equal(suggestions.filter(s => SuggestionKind.Variable === s.kind).length, 1);
    });

  });

});