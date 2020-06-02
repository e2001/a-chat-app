let moment = require('moment');
let {doEncrypt} = require("./crypto-helper.js");


let generateEncryptMessage = (from, text) => {
  let cipherdText = doEncrypt(text);
  return generateMessage(from, cipherdText)
};

let generateMessage = (from, text) => {

  return {
    from,
    text,
    createdAt: moment().valueOf()
  }
};


module.exports = {generateMessage, generateEncryptMessage};

