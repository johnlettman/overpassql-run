import togpx from 'togpx';
import xmlFormat from 'xml-formatter';
import osmtogeojson from 'osmtogeojson';
import { OverpassEndpoint } from 'overpass-ts';
import { optionsHasOverpassEndpoint, type Formatter } from './formatter';
import type { OverpassQuery } from 'overpass-ts/dist/common';

const gpxFormatter: Formatter = (code, options) =>
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
          const gpx = togpx(geo);
          resolve(options.pretty ? xmlFormat(gpx) : gpx);
        } catch (err) {
          reject(err);
        }
      })
      .catch((err) => reject(err));
  });

gpxFormatter.description =
  'an XML schema designed as a common GPS data format for software applications';
gpxFormatter.supportsFiltering = true;
export default gpxFormatter;
