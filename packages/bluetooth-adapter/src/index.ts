// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Adapter, NotImplementedException } from "@node-escpos/adapter";

export default class Bluetooth extends Adapter<[]> {
  static bluetooth;
  static device;
  static connection;
  address: string;
  channel: number;

  constructor(address: string, channel: number) {
    super();
    this.address = address;
    this.channel = channel;
    Bluetooth.loadBluetoothDependency();
    if (Bluetooth.bluetooth)
      Bluetooth.device = new Bluetooth.bluetooth.DeviceINQ();
  }

  static loadBluetoothDependency() {
    if (!this.bluetooth) {
      // this.bluetooth = [ bluetooth library ];
    }
  }

  static async findPrinters() {
    Bluetooth.loadBluetoothDependency();
    if (Bluetooth.device === null)
      Bluetooth.device = new Bluetooth.bluetooth.DeviceINQ();

    const devices = await Bluetooth.device.scan();
    const printers = await Promise.all(devices.map(({ address, name }) => {
      return new Promise((resolve) => {
        Bluetooth.device.findSerialPortChannel(address, (channel: number) => {
          if (channel === -1) {
            resolve(undefined);
          }
          else {
            resolve({
              address,
              name,
              channel,
            });
          }
        });
      });
    }));
    return printers;
  }

  static async getDevice(address: string, channel: number) {
    return new Promise((resolve, reject) => {
      const device = new Bluetooth(address, channel);
      device.open((err) => {
        if (err) return reject(err);
        resolve(device);
      });
    });
  }

  open(callback?: (error: Error | null) => void) {
    Bluetooth.bluetooth.connect(this.address, this.channel, (err: Error, conn) => {
      if (err) {
        callback?.(err);
      }
      else {
        Bluetooth.connection = conn;
        this.emit("connect", Bluetooth.connection);
        callback?.(null);
      }
    });
    return this;
  }

  close(callback?: (error: Error | null) => void) {
    if (Bluetooth.connection === null) {
      callback?.(null);
    }
    else {
      Bluetooth.connection.close((err: Error) => {
        if (err) {
          callback?.(err);
        }
        else {
          this.emit("disconnect", Bluetooth.connection);
          Bluetooth.connection = null;
          callback?.(null);
        }
      });
    }
    return this;
  }

  write(data: string | Buffer, callback?: (error: Error | null) => void) {
    if (Bluetooth.connection === null) {
      callback?.(new Error("No open bluetooth connection."));
    }
    else {
      Bluetooth.connection.write(data, () => {
        this.emit("write", data);
        callback?.(null);
      });
    }
    return this;
  }

  read() {
    return NotImplementedException;
  }
}

