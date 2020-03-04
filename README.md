researchercli
=============

CLI to demonstrate a researcher&#39;s workflow in TWINS

<!-- toc -->
* [Configuration](#configuration)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Configuration
<!-- configuration -->
Configuration for the cli can be found at `src/config.ts`. Please edit it to match your environment before proceeding.

The roster should be placed in `src/roster.ts`
<!-- configurationstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install
$ ./bin/run COMMAND
running command...
$ ./bin/run (-v|--version|version)
researchercli/0.0.0 darwin-x64 node-v12.12.0
$ ./bin/run --help [COMMAND]
USAGE
  $ ./bin/run COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`researchercli demo [DOCUMENT_DARC]`](#researchercli-invite)

## `researchercli demo [DOCUMENT_DARC]`

Sets up the demo and requests consent for data whose symmetric key's access is
controlled by `DOCUMENT_DARC`

```
USAGE
  $ researchercli demo [DOCUMENT_DARC]

OPTIONS
  -h, --help       show CLI help
```

<!-- commandsstop -->
