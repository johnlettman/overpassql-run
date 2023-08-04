import { overpass } from 'overpass-ts';
import { optionsHasOverpassEndpoint, type Formatter } from './formatter';
import type { OverpassQuery } from 'overpass-ts/dist/common';

const osmjsonFormatter: Formatter = (code, options) =>
  new Promise<string>((resolve, reject) => {
    if (!optionsHasOverpassEndpoint(options)) {
      return reject(new Error('Missing Overpass API endpoint.'));
    }

    const query: Partial<OverpassQuery> = {
      name: options?.metadata?.name,
      query: code,
    };

    options.overpass
      .queryJson(query)
      .then((json) => {
        if (options?.metadata?.name) {
          json['name'] = options.metadata.name;
        }

        if (options?.metadata?.description) {
          json['description'] = options.metadata.description;
        }

        resolve(
          JSON.stringify(json, undefined, options?.pretty ? 2 : undefined)
        );
      })
      .catch((err) => reject(err));
  });

osmjsonFormatter.description = 'a JSON format for OpenStreetMaps data';
osmjsonFormatter.supportsFiltering = true;
export default osmjsonFormatter;
