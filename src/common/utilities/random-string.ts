import { CONFIG } from '../../config';

export function randomString(length: number, numbersOnly?: boolean): string {
  const possible = numbersOnly ? CONFIG.randomStringCharsNumbersOnly : CONFIG.randomStringChars;
  const possibleLength = possible.length;
  let result = '';

  for (let i = 0; i < length; i++)
    result += possible.charAt(Math.floor(Math.random() * possibleLength));

  return result;
}
