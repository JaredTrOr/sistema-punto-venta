const { v4: uuidv4 } = require('uuid');

function generarId() {
    return uuidv4();
}

module.exports = generarId;