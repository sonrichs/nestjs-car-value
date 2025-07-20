import {rm} from 'fs/promises';
import {join} from 'path';

global.beforeEach(async () => {
  try {
    // Delete whole test database before running tests
    await rm(join(__dirname, '..', 'test.sqlite'))
  } catch (err){
    // Do nothing if error because file doesn't exist
  }
})