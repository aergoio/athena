#include <stdlib.h>
#include <string.h>

#include <lualib.h>
#include <lauxlib.h>
#include <luajit.h>

#include "state_module.h"
#include "compile.h"

lua_State *luac_vm_newstate()
{
    lua_State *L = luaL_newstate();
    if (L == NULL) {
        return NULL;
    }
    luaL_openlibs(L);
    luac_open_state(L);
    return L;
}

void luac_vm_close(lua_State *L)
{
    if (L != NULL)
        lua_close(L);
}

#define GEN_ABI() \
    do { \
        if (lua_pcall(L, 0, 0, 0) != 0) { \
           return lua_tostring(L, -1); \
        } \
        lua_getfield(L, LUA_GLOBALSINDEX, "abi"); \
        lua_getfield(L, -1, "autoload"); \
        if (lua_pcall(L, 0, 0, 0) != 0) { \
            return lua_tostring(L, -1); \
        } \
        lua_getfield(L, -1, "generate"); \
        if (lua_pcall(L, 0, 1, 0) != 0) { \
            return lua_tostring(L, -1); \
        } \
        if (!lua_isstring(L, -1)) { \
            return "empty ABI string"; \
        } \
    } while(0)

static int writer_buf(lua_State *L, const void *p, size_t size, void *b)
{
      luaL_addlstring((luaL_Buffer *)b, (const char *)p, size);
      return 0;
}

const char *vm_loadstring(lua_State *L, const char *code)
{
    if (luaL_loadstring(L, code) != 0) {
        return lua_tostring(L, -1);
    }
    return NULL;
}

const char *vm_stringdump(lua_State *L, struct compile_result* result)
{
    luaL_Buffer b;

    luaL_buffinit(L, &b);
    if (lua_dump(L, writer_buf, &b) != 0) {
        return lua_tostring(L, -1);
    }
    luaL_pushresult(&b);
    if (!lua_isstring(L, -1)) {
        return "empty bytecode";
    }
	result->bc = (char *)lua_tostring(L, -1);
	result->bc_len = lua_strlen(L, -1);
    lua_pop(L, 1);

    GEN_ABI();

	result->abi = (char *)lua_tostring(L, -1);
	result->abi_len = lua_strlen(L, -1);

    return NULL;
}