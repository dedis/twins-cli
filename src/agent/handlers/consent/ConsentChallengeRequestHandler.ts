import { ConsentService } from '../../protocols/consent/ConsentService';
import { ConnectionService } from 'aries-framework-javascript/build/lib/protocols/connections/ConnectionService';
import { Connection } from 'aries-framework-javascript';
import { InboundMessage } from 'aries-framework-javascript/build/lib/types';

export class ConsentChallengeRequestHandler {
  consentService: ConsentService
  connectionService: ConnectionService

  constructor(consentService: ConsentService, connectionService: ConnectionService) {
    this.consentService = consentService;
    this.connectionService = connectionService;
  }

  async handle(inboundMessage: InboundMessage) {
    // Using theirKey here since recipient_key is set to the public did verkey
    const connection = this.connectionService.findByTheirKey(inboundMessage.sender_verkey);
    if (!connection) {
      throw new Error(`Connection for sender_verkey ${inboundMessage.sender_verkey} does not exist`);
    }
    return this.consentService.challengeResponse(connection, inboundMessage.message.nonce)
  }
}