import logger from 'loglevel';

import { LuaTableFieldTree, luaTypes } from '../../model';

import Visitor from './visitor';
import { buildFuncSnippet } from '../../utils';
import * as luaparseType from './luaparse-types';

export default class LuaTableFieldTreeGenerator implements Visitor {

  protected tableFieldTree: LuaTableFieldTree;

  constructor() {
    this.tableFieldTree = new LuaTableFieldTree();
  }

  public getGenerated() {
    logger.debug("Generated table field tree", this.tableFieldTree);
    return this.tableFieldTree;
  }

  public onCreateNode(node: any) {
    const nodeType = node.type;
    // globalVariable = ...
    // local localVariable = ...
    if (luaparseType.LUAPARSE_ASSIGNMENT_STATEMENT === nodeType ||
        luaparseType.LUAPARSE_LOCAL_STATEMENT === nodeType) {
      this.parseAssignmentStatement(node);
    }
  }

  public onCreateScope(scope: any): void {}

  public onDestroyScope(scope: any): void {}

  public onLocalDeclaration(identifierName: string): void {}

  public onFunctionSignature(signature: any) {
    // only parse named function with table member expression function
    // eg. SomeTable = { field = function (arg1, arg2) ... }
    if (signature.identifier === null ||
        luaparseType.LUAPARSE_TABLE_MEMBER_EXPRESSION !== signature.identifier.type) {
      return;
    }

    const fieldChain = this.parseFieldChain(signature.identifier);
    const lastField = fieldChain[fieldChain.length - 1];
    const parameters: any[] = signature.parameters;
    const funcSnippet = buildFuncSnippet(lastField, parameters.map(p => p.name));
    this.tableFieldTree.addFieldValue(fieldChain, luaTypes.LUA_TYPE_FUNCTION, funcSnippet);
  }

  protected parseAssignmentStatement(node: any) {
    // only parse when init exists
    if (node.init.length === 0) {
      return;
    }

    const identifier = node.variables[0];
    const init = node.init[0];

    // SomeTable = ...
    if (luaparseType.LUAPARSE_IDENTIFIER === identifier.type) {
      // SomeTable = { field = ... }
      if (luaparseType.LUAPARSE_TABLE_CONSTRUCTOR_EXPRESSION === init.type) {
        const fieldChain = this.parseFieldChain(identifier);
        this.parseTable(fieldChain, init);
      }

      // SomeTable = OtherTable { field = ... }
      if (luaparseType.LUAPARSE_TABLE_CALL_EXPRESSION === init.type) {
        // TODO : parse table call
      }
    }

    // SomeTable.field = ...
    if (luaparseType.LUAPARSE_TABLE_MEMBER_EXPRESSION === identifier.type) {
      const fieldChain = this.parseFieldChain(identifier);
      this.addValueForFieldChain(fieldChain, init);
    }

    // SomeTable["field"] = ...
    if (luaparseType.LUAPARSE_TABLE_INDEX_EXPRESSION === identifier.type) {
      // ignore 'SomeTable[33] = ...' since it's array indexing
      if (luaparseType.LUAPARSE_STRING_LITERAL !== identifier.index.type) {
        return;
      }
      const fieldChain = this.parseFieldChain(identifier);
      this.addValueForFieldChain(fieldChain, init);
    }
  }

  protected parseFieldChain(expression: any): any {
    // SomeTable = ...
    if (luaparseType.LUAPARSE_IDENTIFIER === expression.type) {
      return [expression.name];
    }

    // SomeTable.field1.field2 = ...
    if (luaparseType.LUAPARSE_TABLE_MEMBER_EXPRESSION === expression.type) {
      const fieldChain = this.parseFieldChain(expression.base);
      fieldChain.push(expression.identifier.name);
      return fieldChain;
    }

    // SomeTable["member"] = ...
    if (luaparseType.LUAPARSE_TABLE_INDEX_EXPRESSION === expression.type) {
      const fieldChain = this.parseFieldChain(expression.base);
      fieldChain.push(expression.index.value);
      return fieldChain;
    }
  }

  protected parseTable(fieldChain: string[], table: any) {
    const fields: any[] = table.fields;
    fields.forEach(field => {
      // { field = "string" }
      if (luaparseType.LUAPARSE_TABLE_KEY_STRING === field.type) {
        const fieldName = field.key.name;
        this.addValueForFieldChain(fieldChain.concat(fieldName), field.value);
      }

      // { ["fieldName"] = "init" }
      if (luaparseType.LUAPARSE_TABLE_KEY === field.type) {
        // ignore NumericLiteralCase. That's array indexing
        if (luaparseType.LUAPARSE_STRING_LITERAL === field.key.type) {
          const fieldName = field.key.value;
          this.addValueForFieldChain(fieldChain.concat(fieldName), field.value);
        }
      }

      // { field }
      if (luaparseType.LUAPARSE_TABLE_VALUE === field.type) {
        // no special value for 'TableValue'
        const fieldName = field.value.name;
        const memberType = luaTypes.LUA_TYPE_TABLE_MEMBER;
        this.tableFieldTree.addFieldValue(fieldChain.concat(fieldName), memberType, fieldName);
      }
    });
  }

  protected addValueForFieldChain(fieldChain: string[], fieldValue: any): void {
    const valueType = fieldValue.type;
    const resolvedType = luaparseType.resolveType(valueType);

    // SomeTable.field = "234" or 234 or true or nil
    if (luaparseType.LUAPARSE_LITERALS.indexOf(valueType) !== -1) {
      const snippet = fieldChain[fieldChain.length - 1];
      this.tableFieldTree.addFieldValue(fieldChain, resolvedType, snippet);
    }

    // SomeTable.field = function (arg1, arg2) ...
    if (luaparseType.LUAPARSE_FUNCTION_DECLARATION === valueType) {
      const funcName = fieldChain[fieldChain.length - 1];
      const parameters: any[] = fieldValue.parameters;
      const funcSnippet = buildFuncSnippet(funcName, parameters.map(p => p.name));
      this.tableFieldTree.addFieldValue(fieldChain, resolvedType, funcSnippet);
    }

    // SomeTable.field = identifier
    if (luaparseType.LUAPARSE_IDENTIFIER === valueType) {
      // TODO : resolve field tree by semantic analysis
      this.tableFieldTree.addFieldValue(fieldChain, resolvedType, fieldChain[fieldChain.length - 1]);
    }

    // SomeTable.field = { field1 = ... }
    if (luaparseType.LUAPARSE_TABLE_CONSTRUCTOR_EXPRESSION === valueType) {
      this.parseTable(fieldChain, fieldValue);
    }
  }

}