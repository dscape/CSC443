C = gcc

all:
	$(C) -o bin/create_random_file lib/create_random_file.c
	$(C) -o bin/get_histogram lib/get_histogram.c

config:
	npm install

run:
	create_random_file
	get_histogram

create_random_file:
	./bin/create_csv

get_histogram:
	./get_histogram foo 1000
	./get_histogram foo 10000
	./get_histogram foo 100000
	./get_histogram foo 1000000
	./get_histogram foo 10000000
	./get_histogram foo 100000000
	./get_histogram foo 1000000000

clean:
	rm bin/create_random_file
	rm bin/get_histogram
	rm out/*
	rm -rf node_modules/
	rm csv/*
