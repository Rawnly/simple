#! /usr/bin/env node
const getData = require('./libs/_data.js')
const parser = require('./libs/_parser.js')

const fs = require('fs');
const path = require('path');
const https = require('https');

const chalk = require('chalk');
const chili = require('chili-js');
const Conf = require('conf');
const clear = require('clear');
const download = require('simple-download')
const fRun = require('first-run');
const inquirer = require('inquirer');
const meow = require('meow');
const mkdirp = require('mkdirp');

const config = new Conf();
const prompt = inquirer.prompt;
const cli = meow(`
  Usage
    $ simple [subcmd]  [id]

    -d --dest       # Download path.
    -f --full       # If included it will download the full high-res file.
    config          # Commandline config
    get config      # Show active configs

`, {
  boolean: [
    'config',
    'full'
  ],
  string: [
    'dest'
  ],
  alias: {
    d: 'dest',
    f: 'full',
    c: 'config'
  }
});

core(cli.input, cli.flags)

function core(action, flags) {
  clear()

  if (fRun()) {
    config.set('path', path.join(home, 'Pictures'))
    config.set('hq', false)
  }

  if ( action[0] !== undefined && action[0] !== 'get' && action[0] !== 'config' && action[0].length > 0 ) {
    if (action[0].length != 11) {
      const len = action[0].length;

      if (len > 11) {
        console.log('Wrong ID. Too long! (should be 11)');
      } else if (len < 11) {
        console.log( `Wrong ID. Too short! ${chalk.yellow('(should be 11)')}` );
      } else {
        console.log('Invalid ID');
      }

      process.exit()
    }

    const id = parser.id(action[0]);

    getData(id).then((data) => {
      const url = (flags.full === true || config.get('hq')) ? data.urls.full : data.urls.raw;
      const p = (flags.dest) ? flags.dest : config.get('path');

      mkdirp(p, (e) => {
        if (e) throw new Error(e)
      })

      download({
        file: `${id}.jpg`,
        url: url,
        path: p
      }, (pos, item) => {
        console.log(`${item} => ${pos}`);
      })
    })

  } else if (action[0] == 'config' && !action[1]) {
    prompt([
      {
        name: 'destination',
        message: 'Default destination:',
        default: config.get('path'),
        validate: (val) => {
          if (val) {
            return true
          } else {
            return 'Invalid path'
          }
        }
      }, {
        name: 'hq',
        message: 'High res always on?',
        type: 'confirm',
        default: false
      }
    ]).then(answ => {
        clear()
        config.set('hq', answ.hq)
        config.set('path', parser.path(answ.destination))
        console.log('');
        console.log(`Path   : ${chalk.underline.cyan(config.get('path'))}`);
        console.log(`Quality: ${answ.hq ? chalk.green('Best') : chalk.yellow('Good') }` );
        console.log('');
      })
  } else if (action[0] == 'get' && action[1] == 'config') {
    clear()
    console.log();
    console.log(`Path   : ${chalk.underline.cyan(config.get('path'))}`);
    console.log(`Quality: ${config.get('hq') ? chalk.green('Best') : chalk.yellow('Good') }` );
    console.log();
  } else if (action[0] == 'get' && action[1] == 'config.path') {
    clear()
    console.log();
    console.log(`Path   : ${chalk.underline.cyan(config.get('path'))}`);
    console.log();
  } else if (action[0] == 'get' && action[1] == 'config.quality') {
    clear()
    console.log();
    console.log(`Quality: ${config.get('hq') ? chalk.green('Best') : chalk.yellow('Good') }` );
    console.log();
  }
   else {
    console.log(cli.help);
    console.log('');
  }
}
