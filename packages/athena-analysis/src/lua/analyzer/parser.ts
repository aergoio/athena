import logger from 'loglevel';
import luaparse from '@aergoio/luaparse';
import Visitor from './visitor';

const LUA_VERSION = '5.1';

export default class LuaParser {
  delegate: any;

  constructor() {
    this.delegate = luaparse;
  }

  parse(source: string, ...visitors: Visitor[]) {
    try {
      const ast = this.delegate.parse(source, {
        wait: false,
        comments: false,
        scope: true,
        ranges: true,
        locations: true,
        onCreateNode (node: any) {
          logger.debug("onCreateNode", node);
          visitors.forEach(visitor => visitor.onCreateNode(node));
        },
        onCreateScope (scope: any) {
          logger.debug("onCreateScope", scope);
          visitors.forEach(visitor => visitor.onCreateScope(scope));
        },
        onDestroyScope (scope: any) {
          logger.debug("onDestroyScope", scope);
          visitors.forEach(visitor => visitor.onDestroyScope(scope));
        },
        onLocalDeclaration (identifierName: string) {
          logger.debug("onLocalDeclaration", identifierName);
          visitors.forEach(visitor => visitor.onLocalDeclaration(identifierName));
        },
        onFunctionSignature (signature: any) {
          logger.debug("onFunctionSignature", signature);
          visitors.forEach(visitor => visitor.onFunctionSignature(signature));
        },
        luaVersion: LUA_VERSION
      });
      return this._makeResult(ast, null);
    } catch (err) {
      return this._makeResult(null, err);
    }
  }

  _makeResult(ast: any, err: any) {
    return {ast: ast, err: err}
  }

}