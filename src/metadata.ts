export interface Metadata {
  name?: string | null;
  description?: string | null;
}

export function parseMetadataFromComments(overpassql: string): Metadata {
  const regex = /\/\*[\s\S]*?\*\/|\/\/.*$/gm;
  const matches = overpassql.match(regex);

  if (!matches) {
    return {
      name: null,
      description: null,
    };
  }

  let cleanedMatches = matches.map((match) =>
    match
      .replace(/\/\*|\*\/|\/\/|\*|/g, '')
      .split('\n')
      .map((s) => s.trim())
      .join('\n')
      .trim()
  );

  return {
    name: cleanedMatches[0] || null,
    description: cleanedMatches.slice(1).join('\n') || null,
  };
}
