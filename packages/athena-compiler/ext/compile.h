#ifndef _COMPILE_H
#define _COMPILE_H

typedef struct lua_State lua_State;

struct compile_result
{
  char* bc;
  size_t bc_len;
  char* abi;
  size_t abi_len;
};

lua_State *luac_vm_newstate();
void luac_vm_close(lua_State *L);
const char *vm_loadstring(lua_State *L, const char *source);
const char *vm_stringdump(lua_State *L, struct compile_result* result);

#endif /* _COMPILE_H */