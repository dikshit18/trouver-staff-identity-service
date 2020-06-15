const cryptoRandomString = require('crypto-random-string');
exports.generateRandomPassword = () => {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    const alphabets = cryptoRandomString({length: 6, type: 'url-safe'});
    const numbers = cryptoRandomString({length: 4, characters: '1234567890'});
    const specialChars = cryptoRandomString({
      length: 3,
      characters: '!@#$%&*'
    });
    const password = `${alphabets}${specialChars}${numbers}`;
    resolve(password);
  });
};
