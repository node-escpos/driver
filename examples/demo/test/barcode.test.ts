import { Printer } from "@node-escpos/core";
import USB from "@node-escpos/usb-adapter";
import { describe, it } from "vitest";

describe("should work as expected", () => {
  it("printing", async () => {
    const device = new USB();
    const printer = new Printer(device, {});

    await new Promise<void>((resolve) => {
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
        }).finally(() => {
          resolve();
        });
    });
  });
});
