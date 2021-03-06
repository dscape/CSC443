#include <cstdio>
#include <cstdlib>
#include <cassert>
#include <cstring>
#include <fstream>
#include <sstream>
#include <string>

#include "library.h"
#include "serializer.h"
#include "pagemanager.h"
#include "heapmanager.h"

Schema schema(2, 10);

int main(int argc, char **argv) {
    if (argc < 3) {
        printf("USAGE: %s <csv file> <heapfile> [page size]\n", argv[0]);
        exit(1);
    }

    char *csvfile  = argv[1];
    char *heapfile = argv[2];
    int page_size  = argc > 3 ? atoi(argv[3]) : 16384;  // Default to 16K

    std::ifstream csvf(csvfile);
    FILE *heapf = fopen(heapfile, "w+");
    if (!csvf || !heapf) {
        printf("Error opening file(s).\n");
        exit(1);
    }

    long start_time = now();

    Heapfile heap;
    init_heapfile(&heap, page_size, heapf, true);
    int recordSize = fixed_len_sizeof(NULL, schema);
    
    Page p;
    init_fixed_len_page(&p, page_size, recordSize);

    int total_records = 0;
    int page_count = 0;
    int capacity = fixed_len_page_capacity(&p);
    int added = 0; // number of records added to the current page

    while (csvf) {
        Record r(schema);

        std::string buf;
        buf.reserve(recordSize);

        if (!std::getline(csvf, buf))
            break;

        // Fill the record with the CSV data
        std::istringstream stream(buf);
        int pos = 0;
        while (stream && pos < schema.numAttrs) {
            char attr[11];
            if (!stream.getline(attr, 11, ',')) break;
            strcpy((char*)r.at(pos++), attr);
        }

        int slot = add_fixed_len_page(&p, &r, schema);
        added++;
        assert(slot != -1);

        if (added == capacity) {
            // Write page to file and re-initialize.
            assert(write_page(&heap, alloc_page(&heap, schema), &p));
            memset(p.data, 0, p.page_size);
            page_count++;
            total_records += added;
            added = 0;
        }
    }

    if (added > 0) {
        write_page(&heap, alloc_page(&heap, schema), &p);
        page_count++;
        total_records += added;
    }

    long end_time = now();
    printf("NUMBER OF RECORDS: %d\n", total_records);
    printf("NUMBER OF PAGES: %d\n", page_count);
    printf("TIME: %ld milliseconds\n", end_time - start_time);

    /* Free up memory */
    delete [] (char *) p.data;

    fclose(heapf);
    csvf.close();
    return 0;
}
