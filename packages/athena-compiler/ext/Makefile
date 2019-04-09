CC = gcc
CFLAGS = -fPIC -Wall -Wextra -O2 -c
LDFLAGS = -dynamiclib
RM = rm -f

LUAJIT = luajit

SRCS = $(wildcard *.c)
OBJS = $(SRCS:.c=.o)
LUAJIT_OBJS = $(wildcard ${LUAJIT}/src/*.o)
INC = -I $(LUAJIT)/src


TARGET_LIB = libcompiler.dylib

.PHONY: all clean

all: luajit-build ${TARGET_LIB} copy-libs

luajit-build:
	cd $(LUAJIT) && $(MAKE)

luajit-clean:
	cd $(LUAJIT) && $(MAKE) clean

$(TARGET_LIB): $(OBJS)
	$(CC) ${LDFLAGS} -o $@ $^ $(LUAJIT_OBJS)

$(OBJS):
	$(CC) $(CFLAGS) $(INC) $(SRCS)

copy-libs:
	mkdir -p ../src/lua/res
	cp ${TARGET_LIB} ../src/lua/res

clean:
	-${RM} ${TARGET_LIB} ${OBJS}

clean-all: clean luajit-clean
