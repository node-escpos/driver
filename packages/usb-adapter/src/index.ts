import os from "os";

import { Adapter } from "@node-escpos/adapter";
import { Interface, InEndpoint, OutEndpoint, LibUSBException, findBySerialNumber } from "usb";
import { usb, getDeviceList, findByIds } from "usb";

/**
 * [USB Class Codes ]
 * @type {Object}
 * @docs http://www.usb.org/developers/defined_class
 */
const IFACE_CLASS = {
  AUDIO: 0x01,
  HID: 0x03,
  PRINTER: 0x07,
  HUB: 0x09,
};

export default class USBAdapter extends Adapter<[]> {
  device: usb.Device | null = null;
  endpoint: OutEndpoint | null = null;
  deviceToPcEndpoint: InEndpoint | null = null;

  constructor(vid?: number | usb.Device, pid?: number) {
    super();
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    if (vid && pid && typeof vid === "number") {
      this.device = findByIds(vid, pid) || null;
    }
    else if (vid && vid instanceof usb.Device) {
      // Set specific USB device from devices array as coming from USB.findPrinter() function.
      // for example
      // let devices = escpos.USB.findPrinter();
      // => devices [ Device1, Device2 ];
      // And Then
      // const device = new escpos.USB(Device1); OR device = new escpos.USB(Device2);
      this.device = vid;
    }
    else {
      const devices = USBAdapter.findPrinter();
      if (devices && devices.length)
        this.device = devices[0];
    }
    if (!this.device)
      throw new Error("Can not find printer");

    usb.on("detach", (device) => {
      if (device === self.device) {
        self.emit("detach", device);
        self.emit("disconnect", device);
        self.device = null;
      }
    });
  }

  static isPrinter(device: usb.Device): boolean {
    try {
      const length = device.configDescriptor?.interfaces.filter((iface) => {
        return iface.filter((conf) => {
          return conf.bInterfaceClass === IFACE_CLASS.PRINTER;
        }).length;
      }).length;
      return (length !== undefined && length > 0);
    }
    catch (e) {
      // console.warn(e)
      return false;
    }
  }

  static findPrinter() {
    return getDeviceList().filter((device) => USBAdapter.isPrinter(device));
  }

  static getDevice(vid: number, pid: number) {
    return new Promise((resolve, reject) => {
      try {
        const device = findByIds(vid, pid);
        device?.open();
        resolve(device);
      }
      catch (err) {
        reject(err);
      }
    });
  }

  static getDeviceBySerial(serialNumber: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const device = await findBySerialNumber(serialNumber);
        device?.open();
        resolve(device);
      }
      catch (err) {
        reject(err);
      }
    });
  }

  open(callback?: ((error: Error | null) => void) | undefined): this {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    let counter = 0;
    this.device?.open();
    (this.device?.interfaces || []).forEach((iface: Interface) => {
      (function (iface) {
        iface.setAltSetting(iface.altSetting, () => {
          try {
            // http://libusb.sourceforge.net/api-1.0/group__dev.html#gab14d11ed6eac7519bb94795659d2c971
            // libusb_kernel_driver_active / libusb_attach_kernel_driver / libusb_detach_kernel_driver : "This functionality is not available on Windows."
            if (os.platform() !== "win32") {
              if (iface.isKernelDriverActive()) {
                try {
                  iface.detachKernelDriver();
                }
                catch (e) {
                  console.error("[ERROR] Could not detatch kernel driver: %s", e);
                }
              }
            }
            iface.claim(); // must be called before using any endpoints of this interface.
            iface.endpoints.forEach((endpoint) => {
              if (endpoint.direction === "out" && !_this.endpoint)
                _this.endpoint = endpoint as OutEndpoint;

              if (endpoint.direction === "in" && !_this.deviceToPcEndpoint)
                _this.deviceToPcEndpoint = endpoint as InEndpoint;
            });
            if (_this.endpoint) {
              _this.emit("connect", _this.device);
              callback && callback(null);
            }
            else if (++counter === _this.device?.interfaces?.length && !_this.endpoint) {
              callback && callback(new Error("Can not find endpoint from printer"));
            }
          }
          catch (err: any) {
            // Try/Catch block to prevent process from exit due to uncaught exception.
            // i.e LIBUSB_ERROR_ACCESS might be thrown by claim() if USB device is taken by another process
            // example: MacOS Parallels
            callback && callback(err);
          }
        });
      })(iface);
    });
    return this;
  }

  read(callback?: ((data: Buffer) => void) | undefined): void {
    this.deviceToPcEndpoint?.transfer?.(64, (err, data) => {
      if (err)
        console.error(err);
      else if (data)
        callback?.(data);
    });
  }

  write(data: string | Buffer, callback?: ((error: Error | null) => void) | undefined): this {
    this.emit("data", data);
    this.endpoint?.transfer?.(data as Buffer, callback as (error: LibUSBException | undefined, actual: number) => void);
    return this;
  }

  close(callback?: ((error: Error | null) => void) | undefined): this {
    if (!this.device) callback?.(new Error("Device not found"));
    try {
      this.device?.close();
      usb.removeAllListeners("detach");
      callback && callback(null);
      this.emit("close", this.device);
    }
    catch (err: any) {
      callback && callback(err);
    }
    return this;
  }
}
