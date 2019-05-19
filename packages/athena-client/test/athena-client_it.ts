import fs from 'fs';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import { newIdentity, AthenaClient } from '../src';

const endpoint = "localhost:7845";

describe('AthenaClient', () => {

  it('should fetch blockchain status', async () => {
    const athenaClient = new AthenaClient();
    athenaClient.use(endpoint);
    const status = await athenaClient.getBlockchainStatus();
    assert.isNotNull(status.bestBlockHash);
    assert.isNotNull(status.bestHeight);
  });

  it('should fetch account state', async () => {
    const athenaClient = new AthenaClient();
    athenaClient.use(endpoint);
    const identity = await newIdentity();
    const state = await athenaClient.getState(identity.address);
    assert.isNotNull(state.nonce);
    assert.isNotNull(state.balance);
  });

  it('should deploy and execute and get abi contract correctly', async () => {
    const identity = await newIdentity();
    const fee = { price: "0", limit: 0 };
    const amount = "10";

    const key = "key";
    const executeFunc = "set";
    const queryFunc = "get";
    const deployIntVal = 1;
    const deployStringVal = "value1";
    const executeIntVal = 2;
    const executeStringVal = "value2";

    const athenaClient = new AthenaClient();
    athenaClient.use(endpoint);

    const payload = fs.readFileSync(__dirname + '/res/payable-with-args.payload', 'utf8');
    const deployInfo = { payload: payload, args: [ key, deployIntVal, deployStringVal] };
    const deployResult = await athenaClient.deploy(identity, deployInfo, fee, amount);

    athenaClient.prepare(deployResult.contractAddress, deployResult.abi); 

    const queryResultAfterDeploy = await athenaClient.query({ targetFunction: queryFunc, args: [key]});
    assert.equal(queryResultAfterDeploy.intVal, deployIntVal);
    assert.equal(queryResultAfterDeploy.stringVal, deployStringVal);

    const executeInfo = { targetFunction: executeFunc, args: [ key, executeIntVal, executeStringVal ] };
    const executeResult = await athenaClient.execute(identity, executeInfo, fee, amount);
    assert.isNotNull(executeResult);

    const queryResultAfterExecute = await athenaClient.query({ targetFunction: queryFunc, args: [key]});
    assert.equal(queryResultAfterExecute.intVal, executeIntVal);
    assert.equal(queryResultAfterExecute.stringVal, executeStringVal);
  }).timeout(5000);

});