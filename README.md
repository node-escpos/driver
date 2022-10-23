# @node-escpos

<br/>
<br/>
<p align="center">🖨️ ESC/POS Printer driver for Node.js.</p>
<p align="center">[ NOT READY 🔴 ]</p>
<br/>
<br/>

> It is a fork of [node-escpos](https://github.com/song940/node-escpos/blob/v3/.github/FUNDING.yml) with some improvements. Thanks to the original [author](https://github.com/song940). And I'll bring more improvements in the future.

### Improvements
- 🛠 It is rewritten in TypeScript.
- 📦 The new package manager is [pnpm](https://pnpm.io/).
- 🟢 The new test framework is [vitest](https://vitejs.dev).
- 🚀 More stable maintenance.
- 💡 More ideas.
- ...

### Packages

- ✅ [@node-escpos/core](packages/core/README.md)		
- ✅ [@node-escpos/adapter](packages/adapter/README.md)		
- ✅ [@node-escpos/console](packages/console/README.md)		
- ✅ [@node-escpos/screen](packages/screen/README.md)		
- ✅ [@node-escpos/server](packages/server/README.md)		
- ✅ [@node-escpos/network-adapter](packages/network/README.md)		
- ✅ [@node-escpos/usb-adapter](packages/usb/README.md)
- 🛠 [@node-escpos/bluetooth-adapter](packages/bluetooth/README.md)	
- 🛠 [@node-escpos/serialport-adapter](packages/serialport/README.md)	
- 🛠 @node-escpos/editor (A low-code that allow to edit label or receipt and print it directly. ⚡️)

## Example

````javascript
import { Printer } from "@node-escpos/core";
// install escpos-usb adapter module manually
import USB from "@node-escpos/usb-adapter";
// Select the adapter based on your printer type
const device = new USB();

// encoding is optional
const options = { encoding: "GB18030" /* default */ }
const printer = new Printer(device, options);

device.open(function(error){
  printer
    .font("a")
    .align("ct")
    .style("bu")
    .size(1, 1)
    .text("The quick brown fox jumps over the lazy dog")
    .text("敏捷的棕色狐狸跳过懒狗")
    .barcode(1234567, "EAN13", { width: 50, height: 50 })
    .table(["One", "Two", "Three"])
    .tableCustom(
      [
        { text: "Left", align: "LEFT", width: 0.33, style: "B" },
        { text: "Center", align: "CENTER", width: 0.33 },
        { text: "Right", align: "RIGHT", width: 0.33 },
      ],
      { encoding: "cp857", size: [1, 1] }, // Optional
    )
    .qrimage("https://github.com/song940/node-escpos")
    .then((printer) => {
      printer.cut();
      printer.close();
    });
});
````
- See `./examples/demo` for more examples.


## Sponsors

<p align="center">
  <img src='https://github.com/dohooo/sponsors/blob/master/sponsors.png?raw=true'/>
</p>

## License

[MIT](./LICENSE) License © 2022 [Dohooo](https://github.com/dohooo)
