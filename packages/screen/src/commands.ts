export const SCREEN = {
  BS: "\x08", // Moves the cursor one character position to the left
  HT: "\x09", // Moves the cursor one character position to the right
  LF: "\x0A", // Moves the cursor down one line
  US_LF: "\x1F\x0A", // Moves the cursor up one line
  HOM: "\x0B", // Moves the cursor to the left-most position on the upper line (home position)
  CR: "\x0D", // Moves the cursor to the left-most position on the current line
  US_CR: "\x1F\x0D", // Moves the cursor to the right-most position on the current line
  US_B: "\x1F\x42", // Moves the cursor to the bottom position
  US_$: "\x1F\x24", // Moves the cursor to the nth position on the mth line
  CLR: "\x0C", // Clears all displayed characters
  CAN: "\x18", // Clears the line containing the cursor
  US_MD1: "\x1F\x01", // Selects overwrite mode as the screen display mode
  US_MD2: "\x1F\x02", // Selects vertical scroll mode as the screen display mode
  US_MD3: "\x1F\x03", // Selects horizontal scroll mode as the display screen mode
  US_C: "\x1F\x43", // Turn cursor display mode on/off
  US_E: "\x1F\x45", // Sets or cancels the blink interval of the display screen
  US_T: "\x1F\x54", // Sets the counter time and displays it in the bottom right of the screen
  US_U: "\x1F\x55", // Displays the time counter at the right side of the bottom line
  US_X: "\x1F\x58", // Sets the brightness of the fluorescent character display tube
  US_r: "\x1F\x72", // Selects or cancels reverse display of the characters received after this command
  US_v: "\x1F\x76", // Sets the DTR signal in the host interface to the MARK or SPACE state
};
