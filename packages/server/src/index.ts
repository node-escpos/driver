import tcp from "net";

class Server extends tcp.Server {
  constructor(device) {
    super();
    this.device = device;
    this.on("connection", this.request);
  }

  request(client) {
    client.pipe(this.device, {
      end: false,
    });
  }
}

export default Server;
