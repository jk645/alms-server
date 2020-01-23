import * as _ from 'lodash';

export function convertObjectToMap(object) {
  const source = [];

  _.forOwn(object, (value, key) => {
    source.push([key, value]);
  });

  return new Map(source);
}
