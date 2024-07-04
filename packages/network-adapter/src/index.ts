import net from "net";

import { Adapter } from "@node-escpos/adapter";

/**
 * Network Adapter
 */
export default class Network extends Adapter<[device: net.Socket]> {
  private readonly address: string;
  private readonly port: number;
  private readonly connectTimeout: number;
  private readonly readTimeout: number;
  private readonly device: net.Socket;

  /**
   * @param {[type]} address
   * @param {[type]} port
   * @param {[type]} connectTimeout
   * @param {[type]} readTimeout
   */
  constructor(address: string, port = 9100, connectTimeout = 30000, readTimeout = 1000) {
    super();
    this.address = address;
    this.port = port;
    this.connectTimeout = connectTimeout;
    this.readTimeout = readTimeout;
    this.device = new net.Socket();
  }

  /**
   * connect to remote device
   * @praram {[type]} callback
   * @return
   */
  open(callback?: (error: Error | null, device: net.Socket) => void) {
    // start timeout on open
    const connection_timeout = setTimeout(() => {
      this.device.destroy();
      callback && callback(
        new Error(`printer connection timeout after ${this.connectTimeout}ms`), this.device,
      );
    }, this.connectTimeout);

    // connect to net printer by socket (port, ip)
    this.device.on("error", (err) => {
      callback && callback(err, this.device);
    }).on("data", (buf) => {
      // eslint-disable-next-line no-console
      console.log("printer say:", buf);
    }).connect(this.port, this.address, () => {
      clearTimeout(connection_timeout);
      this.emit("connect", this.device);
      callback && callback(null, this.device);
    });
    return this;
  }

  /**
   * write data to printer
   * @param {[type]} data -- byte data
   * @param {Function} callback
   * @return
   */
  write(data: string | Buffer, callback?: (error: Error | null) => void) {
    const handler = (error?: Error) => {
      if (callback) callback(error ?? null);
    };
    if (typeof data === "string") this.device.write(data, handler);
    else this.device.write(data, handler);
    return this;
  }

  read(callback?: (data: Buffer) => void) {
    let timeoutId:NodeJS.Timeout|undefined = undefined;

    // listener to pass to socket.once and socket.off
    const eventListener = (buf: Buffer) => {
      if(timeoutId !== undefined) clearTimeout(timeoutId);
      if (callback) callback(buf);
    }

    // pass empty buffer to callback function when timeout
    timeoutId = setTimeout(() => {
      this.device.off("data", eventListener);
      if (callback) callback(Buffer.from(""));
    }, this.readTimeout);

    this.device.once("data", eventListener);
    return this;
  }

  /**
   * [close description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  close(callback?: (error: Error | null, device: net.Socket) => void) {
    this.device.destroy();
    this.emit("disconnect", this.device);
    callback && callback(null, this.device);
    return this;
  }
}
