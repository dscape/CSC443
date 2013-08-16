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
	./bin/create_random_file_csv

get_histogram:
	./bin/get_histogram out/foo 10000      | tail -n 1  > csv/get_histogram.csv
	./bin/get_histogram out/foo 100000     | tail -n 1 >> csv/get_histogram.csv
	./bin/get_histogram out/foo 1000000    | tail -n 1 >> csv/get_histogram.csv
	./bin/get_histogram out/foo 1000000    | tail -n 1 >> csv/get_histogram.csv
	./bin/get_histogram out/foo 10000000   | tail -n 1 >> csv/get_histogram.csv
	./bin/get_histogram out/foo 100000000  | tail -n 1 >> csv/get_histogram.csv
	./bin/get_histogram out/foo 1000000000 | tail -n 1 >> csv/get_histogram.csv
	./bin/publish_www_get_histogram

clean:
	rm bin/create_random_file
	rm bin/get_histogram
	rm out/*
	rm -rf node_modules/
	rm csv/*
