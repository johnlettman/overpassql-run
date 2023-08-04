import { OverpassEndpoint } from 'overpass-ts';
import { table, type TableUserConfig } from 'table';
import { Argument, Option, Command } from 'commander';

import { name, version, description } from '../package.json';

import { logger } from './logger';
import { formatters } from './format';
import { input, output } from './io';
import { Metadata, parseMetadataFromComments } from './metadata';

export function getFormattersTable() {
  const config: TableUserConfig = {
    columnDefault: {
      wrapWord: true,
    },
    columns: [{ width: 10 }, { width: 60 }, { width: 10 }],
    header: {
      alignment: 'center',
      content: 'Available Output Formats',
    },
  };

  const data = Object.keys(formatters).reduce<[string, string, string][]>(
    (acc, key) => {
      const formatter = formatters[key];
      acc.push([
        key,
        formatter.description || '',
        formatter.supportsFiltering ? 'yes' : 'no',
      ]);
      return acc;
    },
    [['Name', 'Description', 'Supports Filtering']]
  );

  return table(data, config);
}

async function processArguments(
  inputPath: string,
  outputPath: string,
  options: { [name: string]: any }
) {
  options.inputPath = [undefined, '-', 'stdin', '/dev/stdin'].includes(
    inputPath
  )
    ? null
    : inputPath;

  options.outputPath = [undefined, '-', 'stdout', '/dev/stdout'].includes(
    outputPath
  )
    ? null
    : outputPath;
}

export const program = new Command()
  .name(name)
  .version(version, '-v, --version', `display the version of ${name}`)
  .description(description)
  .showSuggestionAfterError(true)
  .helpOption('help, -h, --help')
  .addOption(new Option('--list-formats'))
  .addArgument(
    new Argument('[input-path]', 'path to the OverpassQL query file').default(
      '-',
      'use stdin'
    )
  )
  .addArgument(
    new Argument('[output-path]', 'path to the formatted output file').default(
      '-',
      'use stdout'
    )
  )
  .addOption(
    new Option(
      '-n, --name',
      'metadata name to include in the output document, if supported'
    )
  )
  .addOption(
    new Option(
      '-d, --description',
      'metadata description to include in the output document, if supported'
    )
  )
  .addOption(
    new Option(
      '-c, --copyright <attribution>',
      'metadata copyright information to include in the output document, if supported'
    )
  )
  .addOption(
    new Option(
      '-m, --metadata-from-comments',
      'extract the metadata name and description from the first comment blocks in the OverpassQL source file(s)'
    ).conflicts(['name', 'description'])
  )
  .addOption(
    new Option('-f, --format <format>', 'output GIS file format')
      .choices(Object.keys(formatters))
      .default('geojson')
  )
  .addOption(new Option('-p, --pretty', 'prettify the output GIS file'))
  .addOption(
    new Option(
      '-e, --endpoint <url>',
      'the Overpass API endpoint to utilize for queries'
    ).default('https://overpass-api.de/api/interpreter')
  )
  .action(processArguments);

export function main(argv: string[] = process.argv) {
  program.parse(argv);
  const opts = program.opts();

  if (opts.listFormats) {
    console.log(getFormattersTable());
    process.exit(0);
  }

  input(opts.inputPath)
    .then((source) => {
      const metadata: Metadata = opts.metadataFromComments
        ? parseMetadataFromComments(source)
        : {
            name: opts.name,
            description: opts.description,
          };

      formatters[opts.format](source, {
        overpass: new OverpassEndpoint(opts.endpoint),
        pretty: opts.prettify,
        metadata,
      })
        .then((data) => output(opts.outputPath, data))
        .catch((err) => logger.fatal(err));
    })
    .catch((err) => logger.fatal(err));
}
