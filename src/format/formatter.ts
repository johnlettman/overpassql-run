import { OverpassEndpoint } from 'overpass-ts';
import type { Metadata } from '../metadata';

export interface FormatterOptions {
  overpass?: OverpassEndpoint;
  metadata?: Metadata;
  pretty?: boolean;
}

/**
 * Function type for GeoJSON output formatters.
 */
export interface Formatter {
  (query: string, options?: FormatterOptions): Promise<string>;
  description?: string;
  supportsFiltering?: boolean;
}
/**
 * Programmatic index of GeoJSON output formatters.
 */
export type FormattersIndex = { [name: string]: Formatter };

export function optionsHasOverpassEndpoint(
  options?: FormatterOptions
): boolean {
  return (
    options &&
    'overpass' in options &&
    options.overpass &&
    options.overpass instanceof OverpassEndpoint
  );
}
