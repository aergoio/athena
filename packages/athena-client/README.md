# athena-client

[![npm](https://img.shields.io/npm/v/@aergo/athena-client.svg)](https://www.npmjs.com/package/@aergo/athena-client)
[![npm](https://img.shields.io/npm/dm/@aergo/athena-client.svg)](https://www.npmjs.com/package/@aergo/athena-client)


Provides client wrapper for interacting with aergo node

## Api

```js
const test = async () => {
  // create an account
  const account = await Account.new();

  // encrypt account
  const encrypted = await originAccount.encrypt("password");

  // decrypt identity
  const encrypted = "47NoLteKjMtEGenYRba1xFjmAeibp454gZCgPUCX12TkPyfEZMCN6ZxcYQ1yWXsoXQLBGuCUA";
  const password = "1234";
  const restoredAccount = await Account.from(encrypted, password);

  // create athena client
  const athenaClient = new AthenaClient();

  // set node endpoint
  const endpoint = "localhost:7845";
  athenaClient.use(endpoint);

  // get blockchain status
  const blockchainStatus = await athenaClient.getBlockchainStatus();

  // get account state
  const accountState = await athenaClient.getState(account.address);

  // get abi of already deployed contract
  const queriedAbi = await athenaClient.getABI("AmgnWWfX1g9p3vLFCuw81qNRnf91MvYnNcdCWZJWZQa7QaA2ZTei");

  // deploy contract with 10 aer
  const payload = "some_payload";
  const deployInfo = { payload: payload, args: [ "key", "value" ] };
  const fee = { price: "0", limit: 0 };
  const deployResult = await athenaClient.deploy(account, deployInfo, fee, "10");

  // get contract info
  const contractAddress = deployResult.contractAddress;
  const abi = deployResult.abi;

  // execute contract
  const executeInfo = {
    contractAddress: contractAddress,
    abi: abi,
    targetFunction: "set",
    args: [ "key2", "value2" ]
  };
  const executeResult = await athenaClient.execute(account, executeInfo, fee, "10");

  // query contract
  const queryInto = {
    contractAddress: contractAddress,
    abi: abi,
    targetFunction: "get",
    args: [ "key" ]
  };
  const queryResult = await athenaClient.query(queryInto);
}
```

## Usage

* Install dependenty : `yarn install`
* Lint : `yarn run lint`
* Test : `yarn run test`
* Integration test : `yarn run it`
* Build : `yarn run build`
