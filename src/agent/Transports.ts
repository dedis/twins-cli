import { Agent, InboundTransporter, OutboundTransporter } from 'aries-framework-javascript'
import { OutboundPackage } from 'aries-framework-javascript/build/lib/types';
import * as http from 'http';
import fetch from 'node-fetch';

export class HttpInboundTransporter implements InboundTransporter {
  start(agent: Agent): void {
    const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
      if (!(req.headers['content-type'] == 'application/ssi-agent-wire' || req.headers['content-type'] == 'application/json')) {
        res.writeHead(406);
        return;
      }
      if (req.method != 'POST') {
        res.writeHead(405);
        return;
      }
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      })
      req.on('end', async () => {
        const msg = await agent.receiveMessage(JSON.parse(body));
        res.writeHead(200);
        res.write(JSON.stringify(msg));
        res.end();
      });
    });

    const port = 3000;
    server.listen(port, '0.0.0.0', () => {
      console.log('Listening at port ' + port);
    });

    process.on('SIGTERM', () => {
      server.close(() => process.exit(0));
    });
  }
}

export class HttpOutboundTransporter implements OutboundTransporter {
  async sendMessage(outboundPackage: OutboundPackage, receive_reply: boolean): Promise<any> {
    const body = await fetch(outboundPackage.endpoint || '', {
      headers: [['Content-Type', 'application/ssi-agent-wire']],
      method: 'POST',
      body: JSON.stringify(outboundPackage.payload),
    });
    if (receive_reply) {
      return await body.json();
    }
    return null;
  }
}