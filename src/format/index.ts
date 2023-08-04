import fs from 'fs';
import path from 'path';

import type { FormattersIndex } from './formatter';

export * from './formatter';

export const formatters = fs
  .readdirSync(__dirname)
  .filter((file) => file !== 'index.ts' && file !== 'formatter.ts')
  .reduce<FormattersIndex>((acc, file) => {
    acc[path.basename(file, '.ts')] = require(path.join(
      __dirname,
      file
    )).default;
    return acc;
  }, {});
