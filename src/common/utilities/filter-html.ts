import * as xssFilters from 'xss-filters';

export function filterHtml(source: string): string {
  return xssFilters.inHTMLData(source);
}
