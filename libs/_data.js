const got = require('got');
const chili = require('chili-js');
const path = require('path');


function getData(id, callback) {
  const tok = 'daf9025ad4da801e4ef66ab9d7ea7291a0091b16d69f94972d284c71d7188b34';
  const api_url = `https://api.unsplash.com/photos/${id}?client_id=${tok}`;

  return new Promise((fulfill, reject) => {
    got(api_url).then((response) => {
      const photo = jparse(response.body)
      if (callback !== undefined) {
        callback(photo)
      } else {
        fulfill(photo)
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

module.exports = getData;
