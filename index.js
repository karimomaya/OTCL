let __OTCommands = require('./engine/__OTCommands.js');
let __OTConfig   = require('./engine/__OTConfig.js');

exports.commands = function(domain){
    _OTCommands = new __OTCommands();
    _OTCommands._OTConfig = new __OTConfig(domain);
    return _OTCommands;
};
