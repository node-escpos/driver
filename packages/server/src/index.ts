import tcp from "net";

import type { Adapter } from "@node-escpos/adapter";

class Server<AdapterCloseArgs extends []> extends tcp.Server {
  device: Adapter<AdapterCloseArgs>;
  constructor(device: Adapter<AdapterCloseArgs>) {
    super();
    this.device = device;
    this.on("connection", this.request);
  }

  request(client: tcp.Socket) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    client.pipe(this.device, {
      end: false,
    });
  }
}

export default Server;
