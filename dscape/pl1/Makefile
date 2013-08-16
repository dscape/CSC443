C = gcc

all: create_random_file

create_random_file: create_random_file.c
	$(C) -o create_random_file create_random_file.c
	npm install
	./create_csv

clean:
	rm create_random_file
	rm foo
