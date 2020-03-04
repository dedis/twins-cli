import { Command, flags } from '@oclif/command';
import agent from '../agent/Agent';
// @ts-ignore
import * as QRCode from 'qrcode';
import { Connection } from 'aries-framework-javascript';
import { ConsentService } from '../agent/protocols/consent/ConsentService';
import { Event } from 'aries-framework-javascript/build/lib/agent/events';
import * as indy from 'indy-sdk';
import { ConsentChallengeRequestHandler } from '../agent/handlers/consent/ConsentChallengeRequestHandler';
import { MessageType as ConsentMessageType} from '../agent/protocols/consent/messages';
import { ConsentResponseHandler } from '../agent/handlers/consent/ConsentResponseHandler';
import * as kyber from '@dedis/kyber';
import { publicDidSeed, orgName, studyName } from '../config';

const curve = kyber.curve.newCurve('edwards25519');

export default class Demo extends Command {
  static description = "Renders an invitation as a QR Code and sends a consent request on successful connection";

  static examples = ["$ researchercli demo [DOCUMENT_DARC]"];

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [{ name: "document_darc" }];

  async run() {
    const { args, flags } = this.parse(Demo);
    await agent.init();

    // Connect to buildernet

    const poolConfig = {
      genesis_txn: '/Users/narula/dev/indycli/buildernet.txn'
    }


    indy.setProtocolVersion(2);
    // await indy.createPoolLedgerConfig('buildernet', poolConfig);
    const ph = await indy.openPoolLedger('buildernet');

    const [did, verkey] = await agent.context.wallet.createDid({ seed: publicDidSeed, method_name: 'sov' })
    agent.context.wallet.publicDid = { did, verkey };
    console.log(`Public DID: ${did} created and stored in the wallet`);

    const consentService = new ConsentService(agent.context);
    const consentChallengeRequestHandler = new ConsentChallengeRequestHandler(consentService, agent.connectionService);
    const consentResponseHandler = new ConsentResponseHandler(consentService);
    agent.handlers[ConsentMessageType.ConsentChallengeRequest] = consentChallengeRequestHandler;
    agent.handlers[ConsentMessageType.ConsentResponse] = consentResponseHandler;

    const invitationUrl = await agent.createInvitationUrl();
    const url = await QRCode.toString(invitationUrl, { type: 'terminal' });
    console.log(url);

    agent.context.eventEmitter.on(Event.CONNECTION_ESTABLISHED, (connection: Connection) => {
      agent.context.messageSender.sendMessage(consentService.requestConsent(
        connection,
        args.document_darc,
        orgName,
        studyName,
      ));
    });
  }
}