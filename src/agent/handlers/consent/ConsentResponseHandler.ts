import { ConsentService } from '../../protocols/consent/ConsentService';
import { InboundMessage } from 'aries-framework-javascript/build/lib/types';
import { ConsentStatus } from '../../protocols/consent/messages';

export class ConsentResponseHandler {
  consentService: ConsentService

  constructor(consentService: ConsentService) {
    this.consentService = consentService;
  }

  async handle(inboundMessage: InboundMessage) {
    const { documentDarc, status } = inboundMessage.message;
    console.log('Handling ConsentResponse');
    if (status === ConsentStatus.DENIED) {
        console.log('Consent denied');
        return null;
    }
    return this.consentService.requestReencryption(documentDarc);
  }
}