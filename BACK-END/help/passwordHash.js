const upash = require('upash');
const argon2 = require('@phc/argon2');

upash.install('argon2', argon2)

module.exports = generatePasswordHash = async (password) => await upash.hash(password)
module.exports = verifyPassword = (passwordHash, password) => upash.verify(passwordHash, password)