CC = gcc
CFLAGS = -fPIC -Wall -Wextra -O2 -c
LDFLAGS = -shared
RM = rm -f

LUAJIT = luajit

SRCS = $(wildcard *.c)
OBJS = $(SRCS:.c=.o)
LUAJIT_OBJS = $(wildcard ${LUAJIT}/src/*.o)
INC = -I $(LUAJIT)/src

OSX_TARGET_LIB = libcompiler_osx.dylib
WINDOW_TARGET_LIB = libcompiler_window.dll

.PHONY: all
all: osx clean-all window clean-all

###################################################
## OSX
###################################################

.PHONY: osx
osx: CC := gcc
osx: TARGET_LIB := $(OSX_TARGET_LIB)
osx: luajit-osx $(OSX_TARGET_LIB) copy-lib

.PHONY: luajit-osx
luajit-osx:
	@echo "Building luajit for osx..."
	cd $(LUAJIT)/src && $(MAKE)

$(OSX_TARGET_LIB): osx-build
	@echo "Building library for osx..."
	$(CC) ${LDFLAGS} -o $@ $(OBJS) $(LUAJIT_OBJS)

.PHONY: osx-build
osx-build:
	$(CC) $(CFLAGS) $(INC) $(SRCS)


###################################################
## Windows
###################################################

.PHONY: window
window: CC := $(MINGW_PREFIX)gcc
window: TARGET_LIB := $(WINDOW_TARGET_LIB)
window: luajit-window $(WINDOW_TARGET_LIB) copy-lib

.PHONY: luajit-window
luajit-window:
	@echo "Building luajit for window..."
	cd $(LUAJIT)/src && $(MAKE) CROSS=$(MINGW_PREFIX) TARGET_SYS=Windows

$(WINDOW_TARGET_LIB): window-build
	@echo "Building library for window..."
	$(CC) ${LDFLAGS} -o $@ $(OBJS) $(LUAJIT_OBJS)

.PHONY: window-build
window-build:
	$(CC) $(CFLAGS) $(INC) $(SRCS)


###################################################
## Common
###################################################

.PHONY: copy-lib
copy-lib:
	mkdir -p ../src/lua/res
	cp ${TARGET_LIB} ../src/lua/res

.PHONY: luajit-clean
luajit-clean:
	cd $(LUAJIT)/src && $(MAKE) clean

.PHONY: clean
clean:
	-${RM} ${OSX_TARGET_LIB} ${WINDOW_TARGET_LIB} ${OBJS}

.PHONY: clean-all
clean-all: clean luajit-clean
