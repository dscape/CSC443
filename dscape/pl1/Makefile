C = gcc

all:
	$(C) -o bin/create_random_file create_random_file.c
	$(C) -o bin/get_histogram get_histogram.c

config:
	npm install

create_random_file:
	./create_csv

get_histogram:
	./get_histogram foo 1000
	./get_histogram foo 10000
	./get_histogram foo 100000
	./get_histogram foo 1000000
	./get_histogram foo 10000000
	./get_histogram foo 100000000
	./get_histogram foo 1000000000

clean:
	rm bin/*
	rm foo
