#ifndef HEAPMANAGER_H_
#define HEAPMANAGER_H_

#include <cstdio>
#include "pagemanager.h"

typedef struct {
    FILE *file_ptr;
    int page_size;
} Heapfile;

typedef int PageID;

typedef struct {
    int page_offset;
    int slot;
} RecordID;

/**
 * Initalize a heapfile to use the file and page size given.
 */
void init_heapfile(Heapfile *heapfile, int page_size, FILE *file, bool newHeap = false);

/**
 * Allocate another page in the heapfile.  This grows the file by a page.
 */
PageID alloc_page(Heapfile *heapfile, const Schema& schema = csvSchema);

/**
 * Read a page into memory
 */
bool read_page(Heapfile *heapfile, PageID pid, Page *page);

/**
 * Write a page from memory to disk
 */
bool write_page(Heapfile *heapfile, PageID pid, Page *page);

class RecordIterator {
    public:
    RecordIterator(Heapfile *heapfile);
    Record next();
    bool hasNext();
};

#endif /* HEAPMANAGER_H_ */
