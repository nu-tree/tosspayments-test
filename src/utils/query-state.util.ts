import { parseAsString, UseQueryStateOptions } from 'nuqs';

export const parseAsStringWithDefault = (defaultValue: string, options?: UseQueryStateOptions<string>) => {
  return parseAsString.withDefault(defaultValue).withOptions({ clearOnDefault: true, ...options });
};
