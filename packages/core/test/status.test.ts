import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Adapter } from '@node-escpos/adapter';
import { ErrorCauseStatus, OfflineCauseStatus, Printer, PrinterStatus, RollPaperSensorStatus } from '..//src';

class MockAdapter extends Adapter<[]> {
  open = vi.fn()
  write = vi.fn()
  close = vi.fn()
  read = vi.fn()
}

describe('should', () => {
  const adapter = new MockAdapter();
  const dataWrote = vi.fn();

  // flag to return empty data on getting OnOfflineCauseStatus
  let returnEmptyDataOnOfflineCauseStatus = false;

  beforeEach(() => {
    let readResolver: (value: string|PromiseLike<string>) => void;
    let readRejecter: (reason?: any) => void;
    returnEmptyDataOnOfflineCauseStatus = false;

    adapter.read.mockImplementation(async (callback?: (data: Buffer) => void) => {
      // promise to wait for data writing
      const promise = new Promise<string>((resolve, reject) => {
        // save resolve and reject
        readResolver = resolve;
        readRejecter = reject;
      });
      const result = await promise;
      if (callback) callback(Buffer.from(result));
    });

    adapter.write.mockImplementation((data: string | Buffer, callback?: (error: Error | null) => void) => {
      const normalizedData = data.toString();
      dataWrote(normalizedData)

      // return different data depending on the command received
      switch(normalizedData) {
        case PrinterStatus.commands().join(''):
          readResolver('\x16');
          break;
        case RollPaperSensorStatus.commands().join(''):
          readResolver('\x17');
          break;
        case OfflineCauseStatus.commands().join(''):
          if (returnEmptyDataOnOfflineCauseStatus) {
            readResolver("");
          } else {
            readResolver('\x18');
          }
          break;
        case ErrorCauseStatus.commands().join(''):
          readResolver('\x19');
          break;
        default:
          readRejecter(new Error("Unknown data wrote"));
          break;
      }
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('adapter receive correct data from getStatus', async () => {
    const printer = new Printer(adapter, {})
    await printer.getStatus(PrinterStatus);

    expect(adapter.write).toHaveBeenCalledOnce();

    expect(dataWrote).toBeCalledWith(PrinterStatus.commands().join(''));
  })

  it('data return from adapter can create correct status with correct byte', async () => {
    const printer = new Printer(adapter, {})
    const printerStatus = await printer.getStatus(PrinterStatus);

    expect(adapter.read).toHaveBeenCalledOnce();

    expect(printerStatus.byte).toEqual(22);
  })

  it('getStatuses return all statues with correct byte', async () => {
    const printer = new Printer(adapter, {})
    const printerStatuses = await printer.getStatuses();

    expect(adapter.write).toHaveBeenCalledTimes(4);
    expect(adapter.read).toHaveBeenCalledTimes(4);
    expect(printerStatuses.length).toEqual(4);

    printerStatuses
      .map((status) => status.toJSON())
      .forEach((json) => {
        switch(json.className) {
          case PrinterStatus.name:
            expect(json.byte).toEqual(22);
            break;
          case RollPaperSensorStatus.name:
            expect(json.byte).toEqual(23);
            break;
          case OfflineCauseStatus.name:
            expect(json.byte).toEqual(24);
            break;
          case ErrorCauseStatus.name:
            expect(json.byte).toEqual(25);
            break;
          default:
            expect(false, "unexpected DeviceStatus class:" + json.className).toBeTruthy();
            break;
        }
      })
  })

  it('getStatus throw error when receive empty buffer from adapter', async () => {
    returnEmptyDataOnOfflineCauseStatus = true;
    let receivedError: Error | null = null;

    const printer = new Printer(adapter, {})
    try {
      await printer.getStatus(OfflineCauseStatus);
    } catch (err) {
      if (err instanceof Error) {
        receivedError = err;
      }
    }

    expect(adapter.write).toHaveBeenCalledOnce();
    expect(adapter.read).toHaveBeenCalledOnce();
    expect(receivedError).not.toBeNull();
    expect(receivedError?.message).toEqual("Get status timeout");
  })

  it('getStatuses throw error when receive empty buffer from adapter', async () => {
    returnEmptyDataOnOfflineCauseStatus = true;
    let receivedError: Error | null = null;

    const printer = new Printer(adapter, {})
    try {
      await printer.getStatuses();
    } catch (err) {
      if (err instanceof Error) {
        receivedError = err;
      }
    }

    expect(adapter.write).toHaveBeenCalledTimes(3);
    expect(adapter.read).toHaveBeenCalledTimes(3);
    expect(receivedError).not.toBeNull();
    expect(receivedError?.message).toEqual("Get status timeout");
  })
});