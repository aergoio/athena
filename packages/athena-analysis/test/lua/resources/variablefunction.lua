import "./library.lua"

variable1 = 1
local variable2 = "2"
local variable3

-- v : variable1, variable2, variable3

function someFunc1 (arg1, arg2)
  local variable4 = nil

  -- v : variable1, variable2, variable3, variable4
  -- a : arg1, arg2
  -- someFunc : someFunc1(arg1, arg2), someFunc3()

  -- if v -> v_
  -- for a -> a_
  -- while f -> f_

  return arg1 + arg2
end

-- v : variable1, variable2, variable3
-- someFunc : someFunc1(arg1, arg2), someFunc3()

variable5 = { field = 3 }
local someFunc2 = function (arg3, arg4)

  -- v : variable1, variable2, variable3, variable5
  -- a : arg3, arg4
  -- someFunc : someFunc1(arg1, arg2), someFunc2(arg3, arg4), someFunc3()

  -- if v -> v_
  -- for a -> a_
  -- while f -> f_

  return arg1 + arg2
end

-- v : variable1, variable2, variable3, variable5
-- someFunc : someFunc1 (arg1, arg2), someFunc2(arg1, arg2), someFunc3()

function someFunc3 ()

  -- v : variable1, variable2, variable3, variable5
  -- a : ""
  -- someFunc : someFunc1(arg1, arg2), someFunc2(arg3, arg4), someFunc3()

  -- if v -> v_
  -- for a -> a_
  -- while f -> f_

  return 3
end

local varIABLE6 = 3

-- v : variable1, variable2, variable3, variable5, varIABLE6
-- someFunc : someFunc1(arg1, arg2), someFunc2(arg1, arg2), someFunc3()

-- l : libraryVariable, libraryFunc, libraryTable