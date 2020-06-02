SECRET_KEY = 'secret-key';
let cryptoJS = require('crypto-js');

var doEncrypt = (text) => {
  let cipherd = cryptoJS.AES.encrypt(JSON.stringify(text), SECRET_KEY);
  return cipherd.toString();
};

module.exports = {doEncrypt};
