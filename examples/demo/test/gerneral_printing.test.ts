import { Image, Printer } from "@node-escpos/core";
import USB from "@node-escpos/usb-adapter";
import { join } from "path";
import { describe, it } from "vitest";

describe("should work as expected", () => {
  it("printing", async () => {
    const device  = new USB();
    await new Promise<void>((resolve,reject) => {
      device.open(async function(err){
        if(err){
          reject(err);
          return
        }

        let printer = new Printer(device, {});

        const tux = join(__dirname, '../assets/tux.png');
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
          .finally(resolve)
      });
    });
  });
});
