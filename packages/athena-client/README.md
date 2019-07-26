# athena-client

[![npm](https://img.shields.io/npm/v/@aergo/athena-client.svg)](https://www.npmjs.com/package/@aergo/athena-client)
[![npm](https://img.shields.io/npm/dm/@aergo/athena-client.svg)](https://www.npmjs.com/package/@aergo/athena-client)

Provides client wrapper for interacting with aergo node

## Api

I am too lazy to write tutorial. Just see following test code.

- Account api in [account test](./test/account/account_test.ts)
- Contract, AthenaClient api in [client integration test](./test/athena-client_it.ts)
- Amount api in [amount test](./test/model/amount_test.ts)

## Usage

- Install dependenty : `yarn install`
- Lint : `yarn run lint`
- Test : `yarn run test`
- Integration test : `yarn run it` (Assuming aergo server is running on testmode in a localhost)
- Build : `yarn run build`
