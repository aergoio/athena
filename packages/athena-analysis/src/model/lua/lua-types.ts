// lua types
export const LUA_TYPE_UNKNOWN = "unknown";

export const LUA_TYPE_STRING = "string";
export const LUA_TYPE_NUMERIC = "numeric";
export const LUA_TYPE_BOOLEAN = "boolean";
export const LUA_TYPE_NIL = "nil";
export const LUA_TYPE_VARARG = "vararg";
export const LUA_TYPE_LITERALS = [
  LUA_TYPE_STRING,
  LUA_TYPE_NUMERIC,
  LUA_TYPE_BOOLEAN,
  LUA_TYPE_NIL,
  LUA_TYPE_VARARG
];

export const LUA_TYPE_FUNCTION = "function";
export const LUA_TYPE_TABLE = "table";
export const LUA_TYPE_TABLE_MEMBER = "member";
export const LUA_TYPE_SYSTEM = "system"; // aergo system