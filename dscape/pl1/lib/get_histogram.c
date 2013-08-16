#include <stdio.h>
#include <stdlib.h>
#include <sys/timeb.h>
#include <strings.h>

//
// to start make sure you have an adequately big foo
// or use makefile
//
// e.g. ./create_random_file foo 104857600 1000000
//

#define COMMAND_LEN 50
#define DATA_SIZE 50

//
// execute grep to count the number of chars in the file
// use to contrast with the execution of our program
// to ensure correctness
//
// also, learning
//
int get_popen_data(char *buffer, char *letter) {
  FILE *pf;

  char command[COMMAND_LEN];

  //
  // prepare our command
  //
  sprintf(command, "fgrep -o %c foo | wc -l | awk '{ print $1 }'", letter[0]); 

  //
  // open our pipe
  //
  pf = popen(command,"r"); 

  //
  // failed to open pipe
  //
  if(!pf){
    return -1;
  }
 
  //
  // gets the data for a maximum of
  // `DATA_SIZE` bytes
  //
  fgets(buffer, DATA_SIZE, pf);

  //
  // failed to close command stream
  //
  if (pclose(pf) != 0) {
    return -1;
  }

  return 0;
}

//
// get the current time
//
inline long current_time() {
  struct timeb now;
  ftime(&now);
  return 1000 * now.time + now.millitm;
}

/**
* file_ptr : the file pointer, ready to be read from.
* hist: an array to hold 26 long integers. hist[0] is the
* number of 'A', and hist[1] is the number of 'B', etc.
* block_size: the buffer size to be used.
* milliseconds: time it took to complete the file scan
* total_bytes_read: the amount data in bytes read
*
* returns: -1 if there is an error.
*/
int get_histogram(FILE *file_ptr, long hist[], int block_size, long *milliseconds, long *total_bytes_read) {
  
  //
  // reset our variables since this is called in a loop
  // not doing so will cause problems when we hit the second
  // block and so forth
  //
  memset(hist, 0, sizeof(long) * 26);
  *total_bytes_read = 0;
  *milliseconds  = 0;

  //
  // get the time before we write to file
  //
  long start_time = current_time();

  //
  // allocate a buffer to read to
  //
  char *buffer = calloc(1, block_size);
  
  //
  // read from file
  //
  size_t bytes_read = 0;

  while ((bytes_read = fread(buffer, 1, block_size, file_ptr))) {
    int i;
    *total_bytes_read += bytes_read;

    //
    // update with this block
    //
    for (i = 0; i < bytes_read; i++) {
      hist[*(buffer + i) - 'A']++; 
    }

    //
    // clear the buffer
    //
    bzero(buffer, block_size);
  }
  
  //
  // -1 on file read error
  //
  if (ferror(file_ptr)) {
    return -1;
  }

  //
  // finished doing stuff
  // lets get the end time
  //
  long end_time = current_time();

  *milliseconds = end_time - start_time;

  //
  // all good
  //
  return 0;
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
  // to store the execution time of the 
  // `get_histogram` function
  //
  long milliseconds = 0;

  //
  // store the instagram data
  //
  long hist[26];

  //
  // store the file length
  //
  long filelen = 0;
  
  int ret = get_histogram(file, hist, block_size, &milliseconds, &filelen);

  //
  // end if we could not compute the histogram
  //
  if(ret < 0) {
    printf("Could not compute histogram.\n");
    return ret;
  }

  int i;

  //
  // we are going to keep stdout from running
  // `fgrep -o F foo | wc -l` here
  // this way we can compare and see if the numbers
  // match
  //
  char *stdoutbuffer = calloc(1, DATA_SIZE);

  for(i=0; i < 26; i++) {
    //
    // 
    //
    char ch = 'A' + i;
    int popenok = get_popen_data(stdoutbuffer, &ch);

    if(popenok < 0) {
      printf("Failed to run command\n");
      return popenok;
    }

    printf("%c  %lu %s", ch, hist[i], stdoutbuffer);
    bzero(stdoutbuffer, DATA_SIZE);
  }

  printf("DATA RATE %f kb/sec\n", (double) filelen/milliseconds * 1000 / 1024);
  printf("BLOCK SIZE  %lu bytes\n", block_size);  
  printf("TOTAL BYTES  %lu bytes\n", filelen);  
  printf("TIME  %lu milliseconds\n", milliseconds);  

  //
  // close the fd
  //
  fclose(file);

  //
  // happy!
  //
  return 0;
}
