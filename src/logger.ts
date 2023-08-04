import { Logger } from 'tslog';
import { formatWithOptions } from 'util';

import { name } from '../package.json';

function stderrTransportFormatted(logMetaMarkup, logArgs, logErrors, settings) {
  const logErrorsStr =
    (logErrors.length > 0 && logArgs.length > 0 ? '\n' : '') +
    logErrors.join('\n');

  settings.prettyInspectOptions.colors = settings.stylePrettyLogs;

  console.error(
    logMetaMarkup +
      formatWithOptions(settings.prettyInspectOptions, ...logArgs) +
      logErrorsStr
  );
}

export const logger = new Logger({
  name,
  overwrite: { transportFormatted: stderrTransportFormatted },
});
