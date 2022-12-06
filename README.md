# @node-escpos

<br/>
<br/>
<p align="center">🖨️ ESC/POS Printer driver for Node.js.</p>
<p align="center">[ NOT READY 🔴 ]</p>
<br/>
<br/>

> It is a fork of [node-escpos](https://github.com/song940/node-escpos) with some improvements. Thanks to the original [author](https://github.com/song940). And I'll bring more improvements in the future.

![Hacktober Badge](https://img.shields.io/badge/hacktoberfest-2022-blueviolet)

### Improvements
- 🛠 It is rewritten in TypeScript.
- 📦 The new package manager is [pnpm](https://pnpm.io/).
- 🟢 The new test framework is [vitest](https://vitejs.dev).
- 🚀 More stable maintenance.
- 💡 More ideas.
- ...

### Packages

- ✅ [@node-escpos/core](packages/core/README.md)  [![npm](https://img.shields.io/npm/v/@node-escpos/core.svg?style=flat-square)](https://www.npmjs.com/package/@node-escpos/core) [![npm](https://img.shields.io/npm/dm/@node-escpos/core.svg?style=flat-square&colorB=007ec6)](https://www.npmjs.com/package/@node-escpos/core) [![npm](https://img.shields.io/npm/dw/@node-escpos/core.svg?style=flat-square&colorB=007ec6)](https://www.npmjs.com/package/@node-escpos/core)

- ✅ [@node-escpos/adapter](packages/adapter/README.md)  [![npm](https://img.shields.io/npm/v/@node-escpos/adapter.svg?style=flat-square)](https://www.npmjs.com/package/@node-escpos/adapter) [![npm](https://img.shields.io/npm/dm/@node-escpos/adapter.svg?style=flat-square&colorB=007ec6)](https://www.npmjs.com/package/@node-escpos/adapter) [![npm](https://img.shields.io/npm/dw/@node-escpos/adapter.svg?style=flat-square&colorB=007ec6)](https://www.npmjs.com/package/@node-escpos/adapter)

- ✅ [@node-escpos/console](packages/console/README.md)  [![npm](https://img.shields.io/npm/v/@node-escpos/console.svg?style=flat-square)](https://www.npmjs.com/package/@node-escpos/console) [![npm](https://img.shields.io/npm/dm/@node-escpos/console.svg?style=flat-square&colorB=007ec6)](https://www.npmjs.com/package/@node-escpos/console) [![npm](https://img.shields.io/npm/dw/@node-escpos/console.svg?style=flat-square&colorB=007ec6)](https://www.npmjs.com/package/@node-escpos/console)

- ✅ [@node-escpos/screen](packages/screen/README.md)  [![npm](https://img.shields.io/npm/v/@node-escpos/screen.svg?style=flat-square)](https://www.npmjs.com/package/@node-escpos/screen) [![npm](https://img.shields.io/npm/dm/@node-escpos/screen.svg?style=flat-square&colorB=007ec6)](https://www.npmjs.com/package/@node-escpos/screen) [![npm](https://img.shields.io/npm/dw/@node-escpos/screen.svg?style=flat-square&colorB=007ec6)](https://www.npmjs.com/package/@node-escpos/screen)

- ✅ [@node-escpos/server](packages/server/README.md)  [![npm](https://img.shields.io/npm/v/@node-escpos/server.svg?style=flat-square)](https://www.npmjs.com/package/@node-escpos/server) [![npm](https://img.shields.io/npm/dm/@node-escpos/server.svg?style=flat-square&colorB=007ec6)](https://www.npmjs.com/package/@node-escpos/server) [![npm](https://img.shields.io/npm/dw/@node-escpos/server.svg?style=flat-square&colorB=007ec6)](https://www.npmjs.com/package/@node-escpos/server)

- ✅ [@node-escpos/network-adapter](packages/network/README.md)  [![npm](https://img.shields.io/npm/v/@node-escpos/network-adapter.svg?style=flat-square)](https://www.npmjs.com/package/@node-escpos/network-adapter) [![npm](https://img.shields.io/npm/dm/@node-escpos/network-adapter.svg?style=flat-square&colorB=007ec6)](https://www.npmjs.com/package/@node-escpos/network-adapter) [![npm](https://img.shields.io/npm/dw/@node-escpos/network-adapter.svg?style=flat-square&colorB=007ec6)](https://www.npmjs.com/package/@node-escpos/network-adapter)

- ✅ [@node-escpos/usb-adapter](packages/usb/README.md)  [![npm](https://img.shields.io/npm/v/@node-escpos/usb-adapter.svg?style=flat-square)](https://www.npmjs.com/package/@node-escpos/usb-adapter) [![npm](https://img.shields.io/npm/dm/@node-escpos/usb-adapter.svg?style=flat-square&colorB=007ec6)](https://www.npmjs.com/package/@node-escpos/usb-adapter) [![npm](https://img.shields.io/npm/dw/@node-escpos/usb-adapter.svg?style=flat-square&colorB=007ec6)](https://www.npmjs.com/package/@node-escpos/usb-adapter)

- ✅ [@node-escpos/serialport-adapter](packages/serialport/README.md)  [![npm](https://img.shields.io/npm/v/@node-escpos/serialport-adapter.svg?style=flat-square)](https://www.npmjs.com/package/@node-escpos/serialport-adapter) [![npm](https://img.shields.io/npm/dm/@node-escpos/serialport-adapter.svg?style=flat-square&colorB=007ec6)](https://www.npmjs.com/package/@node-escpos/serialport-adapter) [![npm](https://img.shields.io/npm/dw/@node-escpos/serialport-adapter.svg?style=flat-square&colorB=007ec6)](https://www.npmjs.com/package/@node-escpos/serialport-adapter)	

- 🛠 [@node-escpos/bluetooth-adapter](packages/bluetooth/README.md) [`NEED HELP`](https://github.com/node-escpos/driver/issues/34)


## Example

````javascript
import { Printer } from "@node-escpos/core";
// install escpos-usb adapter module manually
import USB from "@node-escpos/usb-adapter";
// Select the adapter based on your printer type
const device = new USB();

device.open(async function(err){
  if(err){
    // handle error
    return
  }

  // encoding is optional
  const options = { encoding: "GB18030" /* default */ }
  let printer = new Printer(device, options);

  // Path to png image
  const filePath = join("/PATH/TO/IMAGE");
  const image = await Image.load(filePath);

  printer
    .font("a")
    .align("ct")
    .style("bu")
    .size(1, 1)
    .text("The quick brown fox jumps over the lazy dog")
    .text("敏捷的棕色狐狸跳过懒狗")
    .barcode(112233445566, "EAN13", { width: 50, height: 50 })
    .table(["One", "Two", "Three"])
    .tableCustom(
      [
        { text: "Left", align: "LEFT", width: 0.33, style: "B" },
        { text: "Center", align: "CENTER", width: 0.33 },
        { text: "Right", align: "RIGHT", width: 0.33 },
      ],
      { encoding: "cp857", size: [1, 1] }, // Optional
    )
    
  // inject qrimage to printer
  printer = await printer.qrimage("https://github.com/node-escpos/driver")
  // inject image to printer
  printer = await printer.image(
    image, 
    "s8" // changing with image
  )

  printer
    .cut()
    .close()
});
````
- See `./examples/demo` for more examples.


## Sponsors

<p align="center">
  <img src='https://github.com/dohooo/sponsors/blob/master/sponsors.png?raw=true'/>
</p>

## License

[MIT](./LICENSE) License © 2022 [Dohooo](https://github.com/dohooo)
