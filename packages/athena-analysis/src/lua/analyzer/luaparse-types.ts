import { luaTypes } from '../../model';

// luaparse literal types
//   - StringLiteral    "Im String"
//   - NumericLiteral   123 or 12.34
//   - BooleanLiteral   true or false
//   - NilLiteral       nil
//   - VarargLiteral    '...' in 'function func (...)'
export const LUAPARSE_STRING_LITERAL = "StringLiteral";
export const LUAPARSE_LITERALS = [
  LUAPARSE_STRING_LITERAL,
  "NumericLiteral",
  "BooleanLiteral",
  "NilLiteral",
  "VarargLiteral"
];

// luaparse table related nodes
//   - TableConstructorExpression  'local tableName = { ... }' or 'tableName = { ... }'
//   - TableCallExpression         'tableName { field = "init" }'
//   - TableKey                    '{ ["fieldName"] = "init" }' or '{ [33] = "init" }' or '{ [identifier] = "init" }'
//   - TableKeyString              '{ fieldName = "init" }'
//   - TableValue                  '{ withoutInit }'
export const LUAPARSE_TABLE_CONSTRUCTOR_EXPRESSION = "TableConstructorExpression";
export const LUAPARSE_TABLE_CALL_EXPRESSION = "TableCallExpression";
export const LUAPARSE_TABLE_MEMBER_EXPRESSION = "MemberExpression";
export const LUAPARSE_TABLE_INDEX_EXPRESSION = "IndexExpression";
export const LUAPARSE_TABLE_KEY = "TableKey";
export const LUAPARSE_TABLE_KEY_STRING = "TableKeyString";
export const LUAPARSE_TABLE_VALUE = "TableValue";

// luaparse basic statements
//   - FunctionDeclaration   'function (arg1, arg2)' or 'function func1 (arg1, arg2)' including body
//   - AssignmentStatement   'withInitVar = 3' or 'noInitVar'
//   - LocalStatement        'local withInitVar = 3' or 'local noInitVar'
//   - Identifier            all the identifier like values
export const LUAPARSE_FUNCTION_DECLARATION = "FunctionDeclaration";
export const LUAPARSE_ASSIGNMENT_STATEMENT = "AssignmentStatement";
export const LUAPARSE_LOCAL_STATEMENT = "LocalStatement";
export const LUAPARSE_IDENTIFIER = "Identifier";


// luaparse type to domain type
export function resolveType(luaparseType: string) {
  if (null == luaparseType) {
    return luaTypes.LUA_TYPE_UNKNOWN;
  }
  const literalIndex = LUAPARSE_LITERALS.indexOf(luaparseType);
  if (-1 !== literalIndex) {
    return luaTypes.LUA_TYPE_LITERALS[literalIndex];
  } else if (LUAPARSE_FUNCTION_DECLARATION === luaparseType) {
    return luaTypes.LUA_TYPE_FUNCTION;
  } else if (LUAPARSE_TABLE_CONSTRUCTOR_EXPRESSION === luaparseType) {
    return luaTypes.LUA_TYPE_TABLE;
  } else if (LUAPARSE_TABLE_MEMBER_EXPRESSION === luaparseType ||
             LUAPARSE_TABLE_INDEX_EXPRESSION === luaparseType) {
    return luaTypes.LUA_TYPE_TABLE_MEMBER;
  } else {
    return luaTypes.LUA_TYPE_UNKNOWN;
  }
}