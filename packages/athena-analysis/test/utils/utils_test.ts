import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import * as utils from '../../src/utils';

describe("Utils test", () => {

  describe("test buildFuncSnippet", () => {

    it("should return placeholder with argument", () => {
      const funcName = "name";
      const args = [ "arg1", "arg2" ];
      const snippet = utils.buildFuncSnippet(funcName, args);
      assert.equal(snippet, "name(${1:arg1}, ${2:arg2})");
    });

  });

  describe("test isEquals", () => {

    it("should return true for mixed case string compare", () => {
      const target = "StRinG";
      const prefix = "StrI";
      assert.isTrue(utils.contains(target, prefix));
    });

  });

});