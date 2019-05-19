# athena-client

Provides client wrapper for interacting with aergo node

## Api

```js
const test = async () => {
  // create an identity
  const identity = await newIdentity();

  // encrypt identity
  const encrypted = await encryptIdentity(originIdentity, "1234");

  // decrypt identity
  const encrypted = "47NoLteKjMtEGenYRba1xFjmAeibp454gZCgPUCX12TkPyfEZMCN6ZxcYQ1yWXsoXQLBGuCUA";
  const password = "1234";
  const restoredIdentity = await decryptIdentity(encrypted, password);

  // create athena client
  const athenaClient = new AthenaClient();

  // set node endpoint
  const endpoint = "localhost:7845";
  athenaClient.use(endpoint);

  // get blockchain status
  const blockchainStatus = await athenaClient.getBlockchainStatus();

  // get account state
  const blockchainStatus = await athenaClient.getState(identity.address);

  // get abi of already deployed contract
  const contractAddress = "AmgnWWfX1g9p3vLFCuw81qNRnf91MvYnNcdCWZJWZQa7QaA2ZTei";
  const abi = await athenaClient.getABI(contractAddress);

  // deploy contract with 10 aer
  const payload = "some_payload";
  const deployInfo = { payload: payload, args: [ "key", "value" ] };
  const fee = { price: "0", limit: 0 };
  const deployResult = await athenaClient.deploy(identity, deployInfo, fee, "10");

  // prepare contract abi (necessary to execute, query contract)
  athenaClient.prepare(deployResult.contractAddress, deployResult.abi);

  // execute contract
  const executeInfo = { targetFunction: "set", args: [ "key2", "value2" ] };
  const executeResult = await athenaClient.execute(identity, executeInfo, fee);

  // query contract
  const queryResultAfterExecute = await athenaClient.query({ targetFunction: "get", args: [ "key" ]});
}
```

## Usage

* Install dependenty : `yarn install`
* Lint : `yarn run lint`
* Test : `yarn run test`
* Integration test : `yarn run it`
* Build : `yarn run build`
