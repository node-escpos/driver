import { describe, expect, it, vi } from 'vitest';
import { Device, usb } from 'usb';
import USBAdapter from '../src';
import { promisify } from 'util';

describe('should', () => {
  it('Validate findPrinter devices', () => {
    const printers = USBAdapter.findPrinter();
    if (printers.length > 0) {
      // Validate printer iface class for all received printers
      for (const printer of printers) {
        if (printer.configDescriptor !== undefined) {
          let hasPrinterClass = false;
          exit_loop:
          for (const iface of printer.configDescriptor?.interfaces) {
            for (const conf of iface) {
              if (conf.bInterfaceClass === 0x07) {
                hasPrinterClass = true;
                break exit_loop;
              }
            }
          }
          expect(hasPrinterClass).to.be.true;
        }
      }
    }
  });

  it('Validate adapter listeners', async () => {
    const printer = new USBAdapter();
    
    const handler = vi.fn();
    printer.addListener('close', handler);

    const openDevice = promisify(printer.open).bind(printer);
    await openDevice();
    const closeDevice = promisify(printer.close).bind(printer);
    await closeDevice();

    expect(handler).toBeCalledTimes(1);
  });

  it('Validate usb listeners', async () => {
    let listenerCount = usb.listenerCount('detach');
    const printer = new USBAdapter();
    let listenerCountAfter = usb.listenerCount('detach');
    // Save last recognized listener function for validation
    const libraryListenerFn = usb.listeners('detach')[listenerCountAfter - 1];
    expect(listenerCountAfter).to.be.greaterThan(listenerCount);

    // Create custom listener and validate if it still exists after device close
    listenerCount = listenerCountAfter;
    function listenerExec() {}
    usb.on('detach', listenerExec);
    listenerCountAfter = usb.listenerCount('detach');
    expect(listenerCountAfter).to.be.greaterThan(listenerCount);

    const openDevice = promisify(printer.open).bind(printer);
    await openDevice();
    const closeDevice = promisify(printer.close).bind(printer);
    await closeDevice(); // Only the internal listener should be removed

    expect(usb.listenerCount('detach')).to.be.lessThan(listenerCountAfter);
    let libListenerRemoved = true, customListenerStillExist = false;
    for (const listenerFn of usb.listeners('detach')) {
      if (listenerFn === libraryListenerFn) {
        libListenerRemoved = false;
      } else if (listenerFn === listenerExec) {
        customListenerStillExist = true;
      }
    }
    expect(libListenerRemoved).to.be.true;
    expect(customListenerStillExist).to.be.true;
  });
});
