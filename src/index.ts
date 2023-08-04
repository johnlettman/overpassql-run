import { main } from './cli';

if (typeof require !== 'undefined' && require.main === module) {
  main(process.argv);
}
