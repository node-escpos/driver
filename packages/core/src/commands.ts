/**
 * Utility function that converts numbers into hex values
 *
 * @usage:
 *   numToHex(256) => '0100'
 *   numToHex(0) => '00'
 */
const numToHexString = function (value: number | string) {
  value = +value;
  if (!isNaN(value)) {
    value = (value).toString(16);
    while (value.length % 2 !== 0)
      value = `0${value}`;
  }
  return value;
};

export const LF = "\x0A";
export const FS = "\x1C";
export const FF = "\x0C";
export const GS = "\x1D";
export const DLE = "\x10";
export const EOT = "\x04";
export const NUL = "\x00";
export const ESC = "\x1B";
export const TAB = "\x74";
export const EOL = "\n";

/**
 * [FEED_CONTROL_SEQUENCES Feed control sequences]
 * @type {Object}
 */
export const FEED_CONTROL_SEQUENCES = {
  CTL_LF: "\x0A", // Print and line feed
  CTL_GLF: "\x4A\x00", // Print and feed paper (without spaces between lines)
  CTL_FF: "\x0C", // Form feed
  CTL_CR: "\x0D", // Carriage return
  CTL_HT: "\x09", // Horizontal tab
  CTL_VT: "\x0B", // Vertical tab
};

export const CHARACTER_SPACING = {
  CS_DEFAULT: "\x1B\x20\x00",
  CS_SET: "\x1B\x20",
};

export const LINE_SPACING = {
  LS_DEFAULT: "\x1B\x32",
  LS_SET: "\x1B\x33",
};

/**
 * [HARDWARE Printer hardware]
 * @type {Object}
 */
export const HARDWARE = {
  HW_INIT: "\x1B\x40", // Clear data in buffer and reset modes
  HW_SELECT: "\x1B\x3D\x01", // Printer select
  HW_RESET: "\x1B\x3F\x0A\x00", // Reset printer hardware
};

/**
 * [CASH_DRAWER Cash Drawer]
 * @type {Object}
 */
export const CASH_DRAWER = {
  CD_KICK_2: "\x1B\x70\x00\x19\x78", // Sends a pulse to pin 2 []
  CD_KICK_5: "\x1B\x70\x01\x19\x78", // Sends a pulse to pin 5 []
};

/**
 * [MARGINS Margins sizes]
 * @type {Object}
 */
export const MARGINS = {
  BOTTOM: "\x1B\x4F", // Fix bottom size
  LEFT: "\x1B\x6C", // Fix left size
  RIGHT: "\x1B\x51", // Fix right size
};

/**
 * [PAPER Paper]
 * @type {Object}
 */
export const PAPER = {
  PAPER_FULL_CUT: "\x1D\x56\x00", // Full cut paper
  PAPER_PART_CUT: "\x1D\x56\x01", // Partial cut paper
  PAPER_CUT_A: "\x1D\x56\x41", // Partial cut paper
  PAPER_CUT_B: "\x1D\x56\x42", // Partial cut paper
  STAR_FULL_CUT: "\x1B\x64\x02", // STAR printer - Full cut
};

/**
 * [TEXT_FORMAT Text format]
 * @type {Object}
 */
export const TEXT_FORMAT = {

  TXT_NORMAL: "\x1B\x21\x00", // Normal text
  TXT_2HEIGHT: "\x1B\x21\x10", // Double height text
  TXT_2WIDTH: "\x1B\x21\x20", // Double width text
  TXT_4SQUARE: "\x1B\x21\x30", // Double width & height text
  STAR_TXT_EMPHASIZED: "\x1B\x45", // STAR printer - Select emphasized printing
  STAR_CANCEL_TXT_EMPHASIZED: "\x1B\x46", // STAR printer - Cancel emphasized printing

  TXT_CUSTOM_SIZE(width: number, height: number) { // other sizes
    width = width > 8 ? 8 : width;
    width = width < 1 ? 1 : width;
    height = height > 8 ? 8 : height;
    height = height < 1 ? 1 : height;

    const widthDec = (width - 1) * 16; // Values between 1-8
    const heightDec = height - 1; // Values between 1-8
    const sizeDec = widthDec + heightDec;
    /*
    * @todo I would suggest replacing the return line by the code below since
    *         `String.fromCharCode()` can generate undesirable results.
    *
    * return Buffer.from('1d21' + numToHexString(sizeDec), 'hex');
    * */
    return `\x1D\x21${String.fromCharCode(sizeDec)}`;
  },

  TXT_HEIGHT: {
    1: "\x00",
    2: "\x01",
    3: "\x02",
    4: "\x03",
    5: "\x04",
    6: "\x05",
    7: "\x06",
    8: "\x07",
  },
  TXT_WIDTH: {
    1: "\x00",
    2: "\x10",
    3: "\x20",
    4: "\x30",
    5: "\x40",
    6: "\x50",
    7: "\x60",
    8: "\x70",
  },

  TXT_UNDERL_OFF: "\x1B\x2D\x00", // Underline font OFF
  TXT_UNDERL_ON: "\x1B\x2D\x01", // Underline font 1-dot ON
  TXT_UNDERL2_ON: "\x1B\x2D\x02", // Underline font 2-dot ON
  TXT_BOLD_OFF: "\x1B\x45\x00", // Bold font OFF
  TXT_BOLD_ON: "\x1B\x45\x01", // Bold font ON
  TXT_ITALIC_OFF: "\x1B\x34\x00", // Italic font OFF
  TXT_ITALIC_ON: "\x1B\x34\x01", // Italic font ON

  TXT_FONT_A: "\x1B\x4D\x00", // Font type A
  TXT_FONT_B: "\x1B\x4D\x01", // Font type B
  TXT_FONT_C: "\x1B\x4D\x02", // Font type C

  TXT_ALIGN_LT: "\x1B\x61\x00", // Left justification
  TXT_ALIGN_CT: "\x1B\x61\x01", // Centering
  TXT_ALIGN_RT: "\x1B\x61\x02", // Right justification

  STAR_TXT_ALIGN_LA: "\x1B\x1D\x61\x00", // STAR printer - Left alignment
  STAR_TXT_ALIGN_CA: "\x1B\x1D\x61\x01", // STAR printer - Center alignment
  STAR_TXT_ALIGN_RA: "\x1B\x1D\x61\x02", // STAR printer - Right alignment
};

/**
 * Qsprinter-compatible
 * Added by Attawit Kittikrairit
 * [MODEL Model-specific commands]
 * @type {Object}
 */
export const MODEL = {
  QSPRINTER: {
    BARCODE_MODE: {
      ON: "\x1D\x45\x43\x01", // Barcode mode on
      OFF: "\x1D\x45\x43\x00", // Barcode mode off
    },
    BARCODE_HEIGHT_DEFAULT: "\x1D\x68\xA2", // Barcode height default:162
    CODE2D_FORMAT: {
      PIXEL_SIZE: {
        CMD: "\x1B\x23\x23\x51\x50\x49\x58",
        MIN: 1,
        MAX: 24,
        DEFAULT: 12,
      },
      VERSION: {
        CMD: "\x1D\x28\x6B\x03\x00\x31\x43",
        MIN: 1,
        MAX: 16,
        DEFAULT: 3,
      },
      LEVEL: {
        CMD: "\x1D\x28\x6B\x03\x00\x31\x45",
        OPTIONS: {
          L: 48,
          M: 49,
          Q: 50,
          H: 51,
        },
      },
      LEN_OFFSET: 3,
      SAVEBUF: {
        // Format: CMD_P1{LEN_2BYTE}CMD_P2{DATA}
        // DATA Max Length: 256*256 - 3 (65533)
        CMD_P1: "\x1D\x28\x6B",
        CMD_P2: "\x31\x50\x30",
      },
      PRINTBUF: {
        // Format: CMD_P1{LEN_2BYTE}CMD_P2
        CMD_P1: "\x1D\x28\x6B",
        CMD_P2: "\x31\x51\x30",
      },
    },
  },
};

/**
 * [BARCODE_FORMAT Barcode format]
 * @type {Object}
 */
export const BARCODE_FORMAT = {
  BARCODE_TXT_OFF: "\x1D\x48\x00", // HRI barcode chars OFF
  BARCODE_TXT_ABV: "\x1D\x48\x01", // HRI barcode chars above
  BARCODE_TXT_BLW: "\x1D\x48\x02", // HRI barcode chars below
  BARCODE_TXT_BTH: "\x1D\x48\x03", // HRI barcode chars both above and below

  BARCODE_FONT_A: "\x1D\x66\x00", // Font type A for HRI barcode chars
  BARCODE_FONT_B: "\x1D\x66\x01", // Font type B for HRI barcode chars

  BARCODE_HEIGHT(height: number) { // Barcode Height [1-255]
    return Buffer.from(`1d68${numToHexString(height)}`, "hex");
  },
  // Barcode Width  [2-6]
  BARCODE_WIDTH: {
    1: "\x1D\x77\x02",
    2: "\x1D\x77\x03",
    3: "\x1D\x77\x04",
    4: "\x1D\x77\x05",
    5: "\x1D\x77\x06",
  },
  BARCODE_HEIGHT_DEFAULT: "\x1D\x68\x64", // Barcode height default:100
  BARCODE_WIDTH_DEFAULT: "\x1D\x77\x01", // Barcode width default:1

  BARCODE_UPC_A: "\x1D\x6B\x00", // Barcode type UPC-A
  BARCODE_UPC_E: "\x1D\x6B\x01", // Barcode type UPC-E
  BARCODE_EAN13: "\x1D\x6B\x02", // Barcode type EAN13
  BARCODE_EAN8: "\x1D\x6B\x03", // Barcode type EAN8
  BARCODE_CODE39: "\x1D\x6B\x04", // Barcode type CODE39
  BARCODE_ITF: "\x1D\x6B\x05", // Barcode type ITF
  BARCODE_NW7: "\x1D\x6B\x06", // Barcode type NW7
  BARCODE_CODE93: "\x1D\x6B\x48", // Barcode type CODE93
  BARCODE_CODE128: "\x1D\x6B\x49", // Barcode type CODE128
};

/**
 * [CODE2D_FORMAT description]
 * @type {Object}
 */
export const CODE2D_FORMAT = {
  TYPE_PDF417: `${GS}Z` + "\x00",
  TYPE_DATAMATRIX: `${GS}Z` + "\x01",
  TYPE_QR: `${GS}Z` + "\x02",
  CODE2D: `${ESC}Z`,
  QR_LEVEL_L: "L", // correct level 7%
  QR_LEVEL_M: "M", // correct level 15%
  QR_LEVEL_Q: "Q", // correct level 25%
  QR_LEVEL_H: "H", // correct level 30%
};

/**
 * [IMAGE_FORMAT Image format]
 * @type {Object}
 */
export const IMAGE_FORMAT = {
  S_RASTER_N: "\x1D\x76\x30\x00", // Set raster image normal size
  S_RASTER_2W: "\x1D\x76\x30\x01", // Set raster image double width
  S_RASTER_2H: "\x1D\x76\x30\x02", // Set raster image double height
  S_RASTER_Q: "\x1D\x76\x30\x03", // Set raster image quadruple
};

/**
 * [BITMAP_FORMAT description]
 * @type {Object}
 */
export const BITMAP_FORMAT = {
  BITMAP_S8: "\x1B\x2A\x00",
  BITMAP_D8: "\x1B\x2A\x01",
  BITMAP_S24: "\x1B\x2A\x20",
  BITMAP_D24: "\x1B\x2A\x21",
};

/**
 * [GSV0_FORMAT description]
 * @type {Object}
 */
export const GSV0_FORMAT = {
  GSV0_NORMAL: "\x1D\x76\x30\x00",
  GSV0_DW: "\x1D\x76\x30\x01",
  GSV0_DH: "\x1D\x76\x30\x02",
  GSV0_DWDH: "\x1D\x76\x30\x03",
};

/**
 * [BEEP description]
 * @type {string}
 */
export const BEEP = "\x1B\x42"; // Printer Buzzer pre hex

/**
 * [COLOR description]
 * @type {Object}
 */
export const COLOR = {
  0: "\x1B\x72\x00", // black
  1: "\x1B\x72\x01", // red
  REVERSE: "\x1DB1", // Reverses the colors - white text on black background
  UNREVERSE: "\x1DB0", // Default: undo the reverse - black text on white background
};

/**
 * Receipt Enhancements as defining a static bottom or top logo
 * @type {string}
 */
export const RECEIPT_ENHANCEMENT = "\x1C\x28\x45";

/**
 * List of available character sets
 * @type {Object}
 */
export const CHARACTER_SET = {
  TM_T20: {     // Epson TM-T20II
    US: 0,      // U.S.A
    FR: 1,      // France
    DE: 2,      // Germany
    EN: 3,      // England
    DK: 4,      // Denmark
    SE: 5,      // Sweden
    IT: 6,      // Italy
    ES: 7,      // Spain
    JP: 8,      // Japan
    NO: 9,      // Norway
    DK_2: 10,   // Denmark II
    ES_2: 11,   // Spain II
    LATIN_A: 12,// Latin America
    KR: 13,     // Korea
    SI: 14,     // Slovenia
    HR: 14,     // Croatia
    CN: 15,     // China
    VN: 16,     // Vietnam
    ARABIA: 17  // Arabia
  }
}

/**
 * Character Code Table
 */
export const CHARACTER_CODE_TABLE = {
  TM_T20: {
    PC437: 0,       // USA: Standard Europe
    KATAKANA: 1,    // Katakana
    PC850: 2,       // Multilingual
    PC860: 3,       // Portuguese
    PC863: 4,       // Canadian-French
    PC865: 5,       // Nordic
    PC851: 11,      // Greek
    PC853: 12,      // Turkish
    PC857: 13,      // Turkish
    PC737: 14,      // Greek
    ISO8859_7: 15,  // ISO8859-7 (Greek)
    WPC1252: 16,    // WPC1252
    PC866: 17,      // Cyrillic #2
    PC852: 18,      // Latin2
    PC858: 19,      // Euro
    KU42: 20,       // Thai
    TIS11: 21,      // Thai
    TIS18: 26,      // Thai
    TCVN_3: 30,     // Vietnamese
    TCVN_3_2: 31,   // Vietnamese
    PC720: 32,      // Arabic
    WPC775: 33,     // Baltic Rim
    PC855: 34,      // Cyrillic
    PC861: 35,      // Icelandic
    PC862: 36,      // Hebrew
    PC864: 37,      // Arabic
    PC869: 38,      // Greek
    ISO8859_2: 39,  // ISO8859-2 (Latin2)
    ISO8859_15: 40, // ISO8859-15 (Latin9)
    PC1098: 41,     // Farsi
    PC1118: 42,     // Lithuanian
    PC1119: 43,     // Lithuanian
    PC1125: 44,     // Ukrainian
    WPC1250: 45,    // Latin2
    WPC1251: 46,    // Cyrillic
    WPC1253: 47,    // Greek
    WPC1254: 48,    // Turkish
    WPC1255: 49,    // Hebrew
    WPC1256: 50,    // Arabic
    WPC1257: 51,    // Baltic Rim
    WPC1258: 52,    // Vietnamese
    KZ_1048: 53,    // KZ-1048 (Kazakhstan)
    USER_PAGE2: 254,// User-defined page
    USER_PAGE1: 255 // User-defined page
  }
}