import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import * as utils from '../src/utils';

describe('Utils', () => {

  it('should throw error on empty case', () => {
    assert.throw(() => utils.assertNotEmpty(undefined));
    assert.throw(() => utils.assertNotEmpty(null));
    assert.throw(() => utils.assertNotEmpty(""));

    utils.assertNotEmpty("test");
  });

  it('should validate empty arguments', () => {
    assert.isTrue(utils.isEmpty(undefined));
    assert.isTrue(utils.isEmpty(null));
    assert.isTrue(utils.isEmpty(""));

    assert.isTrue(!utils.isEmpty("test"));
  });

});