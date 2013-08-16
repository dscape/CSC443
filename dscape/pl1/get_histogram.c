#include <stdio.h>
#include <stdlib.h>
#include <sys/timeb.h>

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
  if (argc != 3) {
    printf("USAGE: %s <filename> <block size>\n", argv[0]);
    return 1;
  }

  //
  // get file path. get other argv and cast the string
  // to long with `atol`
  //
  char *path = argv[1];
  long block_size = atol(argv[2]);

  //
  // basic check
  //
  if (block_size <= 0) {
    printf("Invalid argument block size (%s)\n", argv[2]);
    return 1;
  }

  //
  // open the file for writing
  //
  FILE *file = fopen(path, "r");

  //
  // error out if we can't open the file
  //
  if (!file) {
    printf("Could not open %s.\n", path);
    return 1;
  }

  //
  // get the time before we write to file
  //
  long start_time = current_time();

  //
  // store the instagram data
  //
  long hist[26];

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
