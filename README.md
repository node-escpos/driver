# @node-escpos

<br/>
<br/>
<p align="center">🖨️ ESC/POS Printer driver for Node.js.</p>
<p align="center">[ NOT READY 🔴 ]</p>
<br/>
<br/>

> It is a fork of [node-escpos](https://github.com/song940/node-escpos) with some improvements. Thanks to the original [author](https://github.com/song940). And I'll bring more improvements in the future.

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
- ✅ [@node-escpos/serialport-adapter](packages/serialport/README.md)	
- 🛠 [@node-escpos/bluetooth-adapter](packages/bluetooth/README.md)	

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

device.open(async function(err){
  if(err){
    // handle error
    return
  }

  let printer = new Printer(device, {});

  // Path to png image
  const tux = join();
  const image = await Image.load(tux);

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
  printer = await printer.image(image, "s8")

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
