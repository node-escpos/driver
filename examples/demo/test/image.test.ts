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
