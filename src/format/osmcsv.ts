import { overpass } from 'overpass-ts';
import { optionsHasOverpassEndpoint, type Formatter } from './formatter';
import type { OverpassQuery } from 'overpass-ts/dist/common';

const osmcsvFormatter: Formatter = (code, options) =>
  new Promise<string>((resolve, reject) => {
    if (!optionsHasOverpassEndpoint(options)) {
      return reject(new Error('Missing Overpass API endpoint.'));
    }

    const query: Partial<OverpassQuery> = {
      name: options?.metadata?.name,
      query: code,
    };

    options!
      .overpass!.queryCsv(query)
      .then((csv) => resolve(csv))
      .catch((err) => reject(err));
  });

osmcsvFormatter.description = 'a CSV format for OpenStreetMaps data';
osmcsvFormatter.supportsFiltering = false;
export default osmcsvFormatter;
