researchercli
=============

CLI to demonstrate a researcher&#39;s workflow in TWINS

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/researchercli.svg)](https://npmjs.org/package/researchercli)
[![Downloads/week](https://img.shields.io/npm/dw/researchercli.svg)](https://npmjs.org/package/researchercli)
[![License](https://img.shields.io/npm/l/researchercli.svg)](https://github.com/gnarula/researchercli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g researchercli
$ researchercli COMMAND
running command...
$ researchercli (-v|--version|version)
researchercli/0.0.0 darwin-x64 node-v12.12.0
$ researchercli --help [COMMAND]
USAGE
  $ researchercli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`researchercli hello [FILE]`](#researchercli-hello-file)
* [`researchercli help [COMMAND]`](#researchercli-help-command)

## `researchercli hello [FILE]`

describe the command here

```
USAGE
  $ researchercli hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ researchercli hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/gnarula/researchercli/blob/v0.0.0/src/commands/hello.ts)_

## `researchercli help [COMMAND]`

display help for researchercli

```
USAGE
  $ researchercli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_
<!-- commandsstop -->
