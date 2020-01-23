import * as _ from 'lodash';

export function convertMapToArray(map, keyName) {
  return Array.from(map.keys())
    .map((key) => {
      return _.merge({[keyName]: key}, map.get(key));
    });
}
