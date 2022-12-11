export function getParityBit(str: string) {
  let parity = 0;
  const reversedCode = str.split("").reverse().join("");
  for (let counter = 0; counter < reversedCode.length; counter += 1)
    parity += parseInt(reversedCode.charAt(counter), 10) * 3 ** ((counter + 1) % 2);

  return ((10 - (parity % 10)) % 10).toString();
}

export function codeLength(str: string) {
  const buff = Buffer.from((str.length).toString(16), "hex");
  return buff.toString();
}

export function charLength(char: string) {
  const code = char.charCodeAt(0);
  return code > 0x7F && code <= 0xFFFF ? 2 : 1; // More than 2bytes count as 2
}

export function textLength(str: string) {
  return str.split("").reduce((accLen, char) => {
    return accLen + charLength(char);
  }, 0);
}

export function textSubstring(str: string, start: number, end?: number) {
  let accLen = 0;
  return str.split("").reduce((accStr, char) => {
    accLen = accLen + charLength(char);
    return accStr + (accLen > start && (!end || accLen <= end) ? char : "");
  }, "");
}

export function upperCase<T extends string>(string: T): Uppercase<T> {
  return string.toUpperCase() as Uppercase<T>;
}

export type AnyCase<T extends string> = Uppercase<T> | Lowercase<T>;

export function isKey<T extends {} | []>(key: string | number | symbol, of: T): key is keyof T {
  return key in of;
}

/**
 * Function to encode a number as hex in format low to high values
 * @param {[Number]} input 
 * @param {[Number]} length of hex couples (0x01 0x00 ...)
 * @returns {[string]} hex value low-high order
 */
export function intLowHighHex(input: number, length: number = 1): string {
  if (input < 0 || input % 1 !== 0) {
    throw new Error('Input must be greater or equal than 0');
  } else if (length < 0) {
    throw new Error('Length muste be greater than 0');
  }
  let ret = ''
  for (let i = 0; i < length; i++) {
    let value = (input % 256).toString(16).toUpperCase();
    if (value === '0' || value.length % 2 !== 0) {
      value = `0${value}`;
    }
    ret += value;
    input = Math.floor(input / 256);
  }
  return ret;
}