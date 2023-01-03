import { Adapter } from "@node-escpos/adapter";
import Noble from "@abandonware/noble";
import { TextEncoder } from "util";

// @ts-ignore
const noble = new Noble({ extended: false });

export interface Device {
  peripheral: Noble.Peripheral
  characteristic: Noble.Characteristic
}

/**
 * Bluetooth device
 * @param {[type]} port
 * @param {[type]} options
 */
export default class Bluetooth extends Adapter<[timeout?: number]> {
  private devices: Device[] = [];
  private address: string;

  constructor(address: string, options: any) {
    super();

    this.address = address;

    noble.on('stateChange', async (state: string) => {
      if (state === 'poweredOn') {
        await noble.startScanningAsync(['18f0']);
      }
    });

    noble.on('discover', async (peripheral: Noble.Peripheral) => {
      if (this.devices.find(d => d.peripheral.id === peripheral.id) === undefined) {
        if (peripheral.state !== 'connected') {
          await peripheral.connectAsync();
        }

        const { characteristics } = await peripheral.discoverSomeServicesAndCharacteristicsAsync(['18f0'], ['2af1']);
        const characteristic = characteristics[0];

        const device = { peripheral, characteristic };
        this.devices.push(device);

        peripheral.once('disconnect', () => {
          this.emit("disconnect", device);
          this.devices = this.devices.filter(d => d.peripheral.id !== peripheral.id);
        });
      }
    });
  }

  /**
   * List Printers
   * @returns {[Device]}
   */
  list() {
    return this.devices;
  }

  get device(): Device | null {
    let device = this.devices.find(d => d.peripheral.address === this.address);
    if (device === undefined) {
      device = this.devices.find(d => !d.peripheral.address);
    }
    return device || null;
  }

  /**
   * open device
   * @param  {Function} callback
   * @return {[type]}
   */
  open(callback?: (error: Error | null) => void) {
    const device = this.device;
    if (device === null)
      throw new Error("Bluetooth device disconnected");
    else {
      if (device.peripheral.state !== 'connected') {
        device.peripheral.connect((error) => {
          if (callback !== undefined) {
            callback(error ? new Error(error) : null);
          }
        });
      } else if (callback !== undefined) {
        callback(null);
      }
    }
    return this;
  }

  /**
   * write data to bluetooth device
   * @param  {[type]}   data      [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  write(data: Buffer | string, callback?: (error: Error | null) => void) {
    const device = this.device;
    if (device === null) throw new Error("Bluetooth device disconnected");
    const message = typeof data === 'string' ? Buffer.from(new TextEncoder().encode(data).buffer) : data;
    device.characteristic.write(message, false, (error) => {
      if (callback) callback(error ? new Error(error) : null);
    });
    return this;
  }

  /**
   * close device
   * @param  {Function} callback  [description]
   * @param  {int}      timeout   [allow manual timeout for emulated COM ports (bluetooth, ...)]
   * @return {[type]} [description]
   */
  close(callback?: (error: Error | null, device: Device) => void, timeout = 0) {
    const device = this.device;
    if (device === null) return this;

    device.peripheral.disconnect(() => {
      if (callback) {
        callback(null, device);
      }
    });
    return this;
  }

  /**
   * read buffer from the printer
   * @param  {Function} callback
   * @return {Serial}
   */
  read(callback?: (data: Buffer) => void) {
    const device = this.device;
    if (device === null) throw new Error("Bluetooth device disconnected");
    device.characteristic.read((error, data) => {
      if (callback && !error) {
        callback(data);
      }
    })
    return this;
  }
}
