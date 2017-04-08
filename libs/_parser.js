'use strict';
const path = require('path');
const fs = require('fs');
const chili = require('chili-js');
const urlRegex = require('url-regex');
const normalize = require('normalize-url');
const chalk = require('chalk');

const Conf = require('conf');
const config = new Conf();

function parseID(string) {

  if (normalize(string.toString()).match(urlRegex())) {
    if (normalize(string.toString()).split('?photo=')[1] === undefined) {
      return normalize(string.toString()).split('/photos/')[1];
    } else {
      return  normalize(string.toString()).split('?photo=')[1];
    }
  }

  return string.toString();
}

function pp(p) {
  const a = p.split('/');

  if (a[0] == '~') {
    const x = a.slice(1).join('/');
    const y = path.join(home, x);
    const z = (typeof y == 'array') ? y.join('/') : y

    return z

  } else if (a[0] == '') {
    return a.join('/')
  }

  return a.join('/')
}


module.exports.id = parseID;
module.exports.path = pp;
