import { Command, flags } from '@oclif/command';
import agent from '../agent/Agent';

export default class Connect extends Command {
  static description = "Initiates a connection with the patient";

  static examples = ["$ researchercli connect"];

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [{ name: "invitationUrl" }];

  async run() {
    const { args, flags } = this.parse(Connect);
    await agent.init();
    const verkey = await agent.acceptInvitationUrl(args.invitationUrl)
    console.log(`Got verkey: ${verkey}`);
  }
}
