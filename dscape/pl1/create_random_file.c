#include <stdio.h>
#include <stdlib.h>
#include <sys/timeb.h>

//
// fills an array with a random 
// string with `bytes` characters
//
void random_array(char *array, long bytes) {
  while (bytes--) {
    //
    // next in array is rand mod 26 plus the starting
    // ascii letter
    //
    *(array++) = 'A' + (rand() % 26);
  }
}

//
// get the current time
//
inline long current_time() {
  struct timeb now;
  ftime(&now);
  return 1000 * now.time + now.millitm;
}

int main(int argc, char *argv[]) {
  //
  // print usage information if we don't have 4 arguments
  //
  if (argc != 4) {
    printf("USAGE: %s <filename> <total bytes> <block size>\n", argv[0]);
    return 1;
  }

  //
  // get file path. get other argv and cast the string
  // to long with `atol`
  //
  char *path = argv[1];
  long total_bytes  = atol(argv[2]);
  long block_size = atol(argv[3]);

  //
  // basic check
  //
  if (total_bytes <= 0 || block_size <= 0) {
    printf("Invalid arguments. Make sure total bytes and block size are long\n", argv[2]);
    return 1;
  }

  //
  // open the file for writing
  //
  FILE *file = fopen(path, "w");

  //
  // error out if we can't open the file
  //
  if (!file) {
    printf("Could not open %s.\n", path);
    return 1;
  }

  //
  // allocate a buffer to store our random arrays
  //
  char *buffer = calloc(1, block_size);

  //
  // get the time before we write to file
  //
  long start_time = current_time();

  //
  // continue writing blocks while we can fit a block
  // in the desised file size
  //
  while (total_bytes >= block_size) {
    //
    // place a random string in the buffer
    //
    random_array(buffer, block_size);

    //
    // write the buffer to file
    //
    fwrite(buffer, 1, block_size, file);

    //
    // tell c to flush anything else from memory to file
    //
    // difference to fsync is in fsync we tell the os
    // to flush the os buffer to disk. 
    //
    fflush(file);

    //
    // written `block_size` bytes
    //
    total_bytes -= block_size;
  }

  //
  // we wrote all the block we could, but if the total_bytes
  // is not a multiple of block_size we have some bytes left to write
  // this ensures those get written too
  //
  if (total_bytes) {
    //
    // same story as above
    //
    random_array(buffer, total_bytes);
    fwrite(buffer, 1, total_bytes, file);
    fflush(file);
  }

  //
  // finished doing stuff
  // lets get the end time
  //
  long end_time = current_time();
  
  //
  //
  //
  printf("%s,%ld,%ld\n", argv[2], block_size, end_time - start_time);

  //
  // close the fd
  //
  fclose(file);

  //
  // happy!
  //
  return 0;
}
