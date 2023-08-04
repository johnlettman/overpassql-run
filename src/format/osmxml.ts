import { overpass } from 'overpass-ts';
import xmlFormat from 'xml-formatter';
import { optionsHasOverpassEndpoint, type Formatter } from './formatter';
import type { OverpassQuery } from 'overpass-ts/dist/common';

const osmxmlFormatter: Formatter = (code, options) =>
  new Promise<string>((resolve, reject) => {
    if (!optionsHasOverpassEndpoint(options)) {
      return reject(new Error('Missing Overpass API endpoint.'));
    }

    const query: Partial<OverpassQuery> = {
      name: options?.metadata?.name,
      query: code,
    };

    options!
      .overpass!.queryXml(query)
      .then((xml) => {
        try {
          resolve(options?.pretty ? xmlFormat(xml) : xml);
        } catch (err) {
          reject(err);
        }
      })
      .catch((err) => reject(err));
  });

osmxmlFormatter.description = 'an XML format for OpenStreetMaps data';
osmxmlFormatter.supportsFiltering = false;
export default osmxmlFormatter;
