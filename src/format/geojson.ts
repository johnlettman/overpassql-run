import togpx from 'togpx';
import xmlFormat from 'xml-formatter';
import osmtogeojson from 'osmtogeojson';
import { OverpassEndpoint } from 'overpass-ts';
import { optionsHasOverpassEndpoint, type Formatter } from './formatter';
import type { OverpassQuery } from 'overpass-ts/dist/common';

const geojsonFormatter: Formatter = (code, options) =>
  new Promise<string>((resolve, reject) => {
    if (!optionsHasOverpassEndpoint(options)) {
      return reject(new Error('Missing Overpass API endpoint.'));
    }

    const query: Partial<OverpassQuery> = {
      name: options?.metadata?.name,
      query: code,
    };

    options!
      .overpass!.queryJson(query)
      .then((json) => {
        try {
          const geo = osmtogeojson(json);
          resolve(
            JSON.stringify(geo, undefined, options?.pretty ? 2 : undefined)
          );
        } catch (err) {
          reject(err);
        }
      })
      .catch((err) => reject(err));
  });

geojsonFormatter.description =
  'an open standard format designed for representing simple geographical features, along with their non-spatial attributes';
geojsonFormatter.supportsFiltering = true;
export default geojsonFormatter;
