CC = g++ 
OPTS = -I $(LEVELDB_DIR)/include -lpthread $(LEVELDB_DIR)/libleveldb.a

all: read write write_moar
	
read: read.cc
	$(CC) -o read read.cc $(OPTS)

write: write.cc
	$(CC) -o write write.cc $(OPTS)

write_moar: write_moar.cc
	$(CC) -o write_moar write_moar.cc $(OPTS)

clean:
	rm -rf read write leveldb_dir

test: all
	./write
	./write_moar
	./read