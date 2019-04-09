import fs from 'fs';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import * as endian from '../../src/util/endian';

describe('endian utils', () => {

  it('should convert to little endian corretly', () => {
    const actual = endian.numberToByteArray(Math.pow(2, 16) + Math.pow(2, 8) + 3);
    const expected = Buffer.from([3, 1, 1, 0]);
    assert.equal(actual.toString(), expected.toString());
  });

})