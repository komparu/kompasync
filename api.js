var rp = require('request-promise');

exports.all = function*(next) {
  this.type = 'json';
  this.body = yield this.request.body.uri.map(uri => rp({uri: uri, headers: this.request.body.headers, json: this.request.body.json}));

  yield next;

  this.status = 200;
};

exports.merge = function*(next) {
  if (!Array.isArray(this.body)) {
    throw new Error('Response is not an array');
  }

  this.body = this.body.reduce((carry, response) => {
    Object.keys(response).map(x => {
      if (Array.isArray(response[x])) {
        if (!carry.hasOwnProperty(x))
          carry[x] = response[x];
        else if (!Array.isArray(carry[x]))
          throw new Error('Carry property “' + x + '” is not an array');
        else
          carry[x] = carry[x].concat(response[x]);
      }
    });
    return carry;
  }, {});

  yield next;
};