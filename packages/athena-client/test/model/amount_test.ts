import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import { Amount } from '../../src/model';

describe('Amount', () => {

  it('should create aergo, gaer, aer exactly', async () => {
    // when
    const oneAergo = new Amount("1", "aergo");
    const oneGaer = new Amount("1", "gaer");
    const oneAer = new Amount("1", "aer");

    // then
    assert.isTrue(oneAergo.toUnit("aer").equal(new Amount("1000000000000000000", "aer")));
    assert.isTrue(oneGaer.toUnit("aer").equal(new Amount("1000000000", "aer")));
    assert.isTrue(oneAer.toUnit("aer").equal(new Amount("1", "aer")));
  });

  it('should display with unit exactly', async () => {
    // when
    const oneAergo = new Amount("1", "aergo");
    const oneGaer = new Amount("1", "gaer");
    const oneAer = new Amount("1", "aer");

    // then
    assert.equal(oneAergo.toUnit("aergo").toString(), "1 aergo");
    assert.equal(oneAergo.toUnit("gaer").toString(), "1000000000 gaer");
    assert.equal(oneAergo.toUnit("aer").toString(), "1000000000000000000 aer");

    assert.equal(oneGaer.toUnit("aergo").toString(), "0.000000001 aergo");
    assert.equal(oneGaer.toUnit("gaer").toString(), "1 gaer");
    assert.equal(oneGaer.toUnit("aer").toString(), "1000000000 aer");

    assert.equal(oneAer.toUnit("aergo").toString(), "0.000000000000000001 aergo");
    assert.equal(oneAer.toUnit("gaer").toString(), "0.000000001 gaer");
    assert.equal(oneAer.toUnit("aer").toString(), "1 aer");
  });

  it('should display without unit exactly', async () => {
    // when
    const oneAergo = new Amount("1", "aergo");
    const oneGaer = new Amount("1", "gaer");
    const oneAer = new Amount("1", "aer");

    // then
    assert.equal(oneAergo.toUnit("aergo").formatNumber(), "1");
    assert.equal(oneAergo.toUnit("gaer").formatNumber(), "1000000000");
    assert.equal(oneAergo.toUnit("aer").formatNumber(), "1000000000000000000");

    assert.equal(oneGaer.toUnit("aergo").formatNumber(), "0.000000001");
    assert.equal(oneGaer.toUnit("gaer").formatNumber(), "1");
    assert.equal(oneGaer.toUnit("aer").formatNumber(), "1000000000");

    assert.equal(oneAer.toUnit("aergo").formatNumber(), "0.000000000000000001");
    assert.equal(oneAer.toUnit("gaer").formatNumber(), "0.000000001");
    assert.equal(oneAer.toUnit("aer").formatNumber(), "1");
  });

});