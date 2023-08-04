import tokml from 'tokml';
import xmlFormat from 'xml-formatter';
import { OverpassEndpoint } from 'overpass-ts';
import osmtogeojson from 'osmtogeojson';
import { optionsHasOverpassEndpoint, type Formatter } from './formatter';
import type { OverpassQuery } from 'overpass-ts/dist/common';

const kmlFormatter: Formatter = (code, options) =>
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
        try {
          const geo = osmtogeojson(json);
          const kml = tokml(geo);
          resolve(options.pretty ? xmlFormat(kml) : kml);
        } catch (err) {
          reject(err);
        }
      })
      .catch((err) => reject(err));
  });

kmlFormatter.description =
  'an XML notation for expressing geographic annotation and visualization within two-dimensional maps and three-dimensional Earth browsers';
kmlFormatter.supportsFiltering = true;
export default kmlFormatter;
