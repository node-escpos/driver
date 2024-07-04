import net from "net";
import { describe, expect, it, vi } from 'vitest';
import Network from '../src/';
import { DeviceStatus, Printer, PrinterStatus, StatusJSONElement } from '../../core';


describe('should', () => {
  const testServerIP = "127.0.0.1";
  const testServerPort = 65178;

  it('get status from test server', async () => {
    const server = net.createServer((s) => {
      s.on('data', (d) => {
        s.write('\x16')
      });
    }).listen(testServerPort,testServerIP);

    const device = new Network(testServerIP, testServerPort, 3000, 1000);

    const getStatusTask = new Promise<PrinterStatus>((resolve, reject) => {
      device.open(async function(err: Error | null, dev: net.Socket) {
        if(err) return reject(err);
    
        try{
          const options = { encoding: "BIG5"};
          const printer = new Printer(device, options);
          const status = await printer.getStatus(PrinterStatus);
          resolve(status);
        } catch(err) {
          return reject(err);
        }
      });
    });

    const result = await getStatusTask;

    expect(result.byte).toEqual(22);
    
    server.close();
  });

  it('fail get status from test server with delay', async () => {
    const server = net.createServer((s) => {
      s.on('data', (d) => {
        // write data after 500 ms
        setTimeout(() => s.write('\x16'), 500);
      });
    }).listen(testServerPort,testServerIP);

    const device = new Network(testServerIP, testServerPort, 3000, 100);

    const getStatusTask = new Promise<PrinterStatus|undefined>((resolve, reject) => {
      device.open(async function(err: Error | null, dev: net.Socket) {
        if(err) return reject(err);
    
        try{
          const options = { encoding: "BIG5"};
          const printer = new Printer(device, options);
          const status = await printer.getStatus(PrinterStatus);
          resolve(status);
        } catch(err) {
          return reject(err);
        }
      });
    });

    let error:any;

    try{
      await getStatusTask;
    } catch(err) {
      error = err;
    }

    expect(error).not.null;

    server.close();
  });

  it('get statuses from test server', async () => {
    const server = net.createServer((s) => {
      s.on('data', (d) => {
        if(d.toString() === "\x10\x04\x01") {
          s.write('\x16')
        } else {
          s.write('\x12')
        }
      });
    }).listen(testServerPort,testServerIP);

    const device = new Network(testServerIP, testServerPort, 3000, 1000);

    const getStatusTask = new Promise<DeviceStatus[]>((resolve, reject) => {
      device.open(async function(err: Error | null, dev: net.Socket) {
        if(err) return reject(err);
    
        try{
          const options = { encoding: "BIG5"};
          const printer = new Printer(device, options);
          const statuses = await printer.getStatuses();
          resolve(statuses);
        } catch(err) {
          return reject(err);
        }
      });
    });

    const result = await getStatusTask;

    expect(result).toHaveLength(4)

    result.forEach((r) => {
      if(r instanceof PrinterStatus) {
        expect(r.byte).toEqual(22);
      } else {
        expect(r.byte).toEqual(18);
      }
    });

    server.close();
  });

  it('fail get statuses from test server with delay', async () => {
    const server = net.createServer((s) => {
      s.on('data', (d) => {
        if(d.toString() === "\x10\x04\x01") {
          s.write('\x16')
        } else if(d.toString() === "\x10\x04\x02") {
          // write data after 500 ms
          setTimeout(() => s.write('\x12'), 500);
        } else {
          s.write('\x12')
        }
      });
    }).listen(testServerPort,testServerIP);

    const device = new Network(testServerIP, testServerPort, 3000, 100);

    const getStatusTask = new Promise<DeviceStatus[]>((resolve, reject) => {
      device.open(async function(err: Error | null, dev: net.Socket) {
        if(err) return reject(err);
    
        try{
          const options = { encoding: "BIG5"};
          const printer = new Printer(device, options);
          const statuses = await printer.getStatuses();
          resolve(statuses);
        } catch(err) {
          return reject(err);
        }
      });
    });

    let error:any;

    try{
      await getStatusTask;
    } catch(err) {
      error = err;
    }

    expect(error).not.null;

    server.close();
  });
})
