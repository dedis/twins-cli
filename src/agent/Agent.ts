import { Agent } from 'aries-framework-javascript';
import { InitConfig } from 'aries-framework-javascript/build/lib/types';
import { HttpInboundTransporter, HttpOutboundTransporter } from './Transports';
// @ts-ignore
import * as indy from 'indy-sdk';
import { agentUrl } from '../config';


const config: InitConfig = {
  port: 80,
  url: agentUrl,
  walletConfig: {
    id: 'ResearcherWallet'
  },
  walletCredentials: {
    key: 'CHANGEME', 
  },
  label: 'ResearcherAgent',
}

const inboundTransporter = new HttpInboundTransporter();
const outboundTransporter = new HttpOutboundTransporter();
const agent = new Agent(config, inboundTransporter, outboundTransporter, indy);


export default agent;