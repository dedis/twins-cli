import * as child_process from 'child_process';
import * as fs from 'fs'
import { createConsentRequest, createConsentChallengeResponse } from './messages';
import { createOutboundMessage } from 'aries-framework-javascript/build/lib/protocols/helpers';
import { Connection } from 'aries-framework-javascript';
import { Context } from 'aries-framework-javascript/build/lib/agent/Context';
import { DidInfo } from 'aries-framework-javascript/build/lib/wallet/Wallet';
import { IndyWallet } from 'aries-framework-javascript/build/lib/wallet/IndyWallet';

import * as Cothority from '@dedis/cothority';
import * as kyber from '@dedis/kyber';
import rosterTOML from '../../../roster';
import { SignerDid } from '@dedis/cothority/darc';
import { SkipchainRPC } from '@dedis/cothority/skipchain';
import { byzcoinInstanceId, writeInstanceId, cryptUtilPath, decryptedFilePath, encryptedFilePath } from '../../../config';

const curve = kyber.curve.newCurve('edwards25519');

const fsPromise = fs.promises;

export class ConsentService {
  context: Context

  constructor(context: Context) {
    this.context = context;
  }

  requestConsent(connection: Connection, documentDarc: string, orgName: string, studyName: string) {
    const didInfo = this.context.wallet.getPublicDid() as DidInfo;
    return createOutboundMessage(connection, createConsentRequest(documentDarc, orgName, studyName, didInfo.did));
  }

  challengeResponse(connection: Connection, nonce: string) {
    return createOutboundMessage(connection, createConsentChallengeResponse(nonce));
  }

  async requestReencryption(documentDarc: string) {
    console.log('Requesting rencryption...');
    try {
      const roster = Cothority.network.Roster.fromTOML(rosterTOML);
      const skipchainRpc = new SkipchainRPC(roster);
      const latestBlock = await skipchainRpc.getLatestBlock(byzcoinInstanceId);
      console.log(`LatestBlock id: ${latestBlock.hash.toString('hex')}`)
      const byzcoinRpc = await Cothority.byzcoin.ByzCoinRPC.fromByzcoin(
        roster,
        byzcoinInstanceId,
        undefined,
        undefined,
        latestBlock,
      );

      console.log('Getting write Instance');
      const writeInstance = await Cothority.calypso.CalypsoWriteInstance.fromByzcoin(
        byzcoinRpc,
        writeInstanceId,
      );

      console.log('Generating keypair');
      const priv = curve.scalar().pick();
      const pub = curve.point().mul(priv);

      const ocsRpc = new Cothority.calypso.OnChainSecretRPC(byzcoinRpc, roster);

      const did = (this.context.wallet.getPublicDid() as DidInfo).did;
      console.log('Public did: ', did);
      const wallet = this.context.wallet as IndyWallet
      console.log(`wallet handle: ${wallet.wh}`);
      const signer = new SignerDid(wallet.signBuffer.bind(wallet), { did });
      console.log('Spawning a read instance');
      console.log(writeInstance.write.extradata.toString());
      const readInst = await writeInstance.spawnRead(pub, [signer]);
      console.log(`Read instance spawned ${readInst.id.toString('hex')}`);
      const key = (await readInst.decrypt(
        ocsRpc,
        priv
      )).toString('hex');
      console.log(`symmmetric key: ${key}`);
      const encryptedDataHex = (await fsPromise.readFile(encryptedFilePath)).toString('hex');
      const decryptedData =  await this.decryptData(key, encryptedDataHex);
      await fsPromise.writeFile(decryptedFilePath, decryptedData);
      child_process.exec(`/usr/bin/open ${decryptedFilePath}`);
    } catch (e) {
      console.log(e);
      console.log(JSON.stringify(e));
    }
    return null;
  }

  private decryptData(key: string, dataHex: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      child_process.execFile(cryptUtilPath, [
        'decrypt',
        '--keyAndInitVal',
        key,
        '--data',
        dataHex,
        '-x'
      ], { encoding: 'buffer'}, (err, stdout: Buffer, stderr: Buffer) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(stdout);
      });
    });
  }
}