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

const SPLIT_REGEX = /(^(?:\d\d){2,})|((?<=\D)(?:(?:\d\d){3,})(?=\d?\D))|((?:\d\d){2,}$)/;
//                  /(--beginning--)|--------(------middle--)----------|(-----end-----)/
/**
 * Helper function for barcode type CODE128, split string into blocks to optimize barcode length
 * Refer to following Wikipedia page
 * https://en.wikipedia.org/wiki/Code_128#Barcode_length_optimization_by_Code_128_Type-C
 * @param {[string]} input 
 * @returns {[string[]]} blocks of string for optimized CODE128 barcode length
 */
export function splitForCode128(str: string): string[] {
  // No need to match REGEX for short string
  if(str.length <= 4)
    return [str];

  // Find 4+ consecutive and even number of digits at the beginning or end
  // Find 6+ consecutive and even number of digits at the middle
  //
  // "12345ABC2345678BCD3456789CDE98765" =>
  // ["1234","5ABC","234567","8BCD","345678","9CDE9","8765"]
  return str.split(SPLIT_REGEX).filter(s => s !== "" && s !== undefined);
}

const USE_CODEC_REGEX = /^((?:\d\d){1,})$/;
/**
 * Generate control code to print CODE128 on Xprinter brand printer
 * Barcode length is optimized
 * Documentation (Chinese only):
 * https://www.xprinter.net/companyfile/1/
 * @param {[string]} input 
 * @returns {[string]} control code for printing
 */
export function genCode128forXprinter(barcode:string): string {
  const toCodeC = (s:string) => 
      "{C" + s.match(/\d{2}/g) // split every 2 digit
              ?.map(num => String.fromCharCode(Number(num))) 
              ?.join('');
  
  const toCodeB = (s:string) => "{B" + s.replace('{','{{');

  const blocks = splitForCode128(barcode)
  const dataPart = blocks.map(block => USE_CODEC_REGEX.test(block) ? toCodeC(block) : toCodeB(block))
                          .join('');
  const dataLength = dataPart.length;

  if (dataLength > 255)
    throw new Error("Barcode data is too long");

  return String.fromCharCode(dataLength) + dataPart;
}


