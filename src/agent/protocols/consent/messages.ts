import * as uuid from 'uuid/v4';

export enum MessageType {
  ConsentRequest = 'https://dedis.epfl.ch/consent/1.0/consent-request',
  ConsentChallengeRequest = 'https://dedis.epfl.ch/consent/1.0/consent-challenge-request',
  ConsentChallengeResponse = 'https://dedis.epfl.ch/consent/1.0/consent-challenge-response',
  ConsentResponse = 'https://dedis.epfl.ch/consent/1.0/consent-response'
}

export enum ConsentStatus {
  DENIED,
  GRANTED,
}

export function createConsentRequest(documentDarc: string, message: string, publicDid: string) {
  return {
    '@id': uuid(),
    '@type': MessageType.ConsentRequest,
    documentDarc,
    comment: message,
    publicDid,
  };
}

export function createConsentChallengeResponse(nonce: string) {
  return {
    '@id': uuid(),
    '@type': MessageType.ConsentChallengeResponse,
    nonce,
  }
}

export function createConsentResponse(status: ConsentStatus) {
  return {
    '@id': uuid(),
    '@type': MessageType.ConsentResponse,
    status,
  }
}