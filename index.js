let __OTCommands = require('./engine/__OTCommands.js');
let __OTConfig   = require('./engine/__OTConfig.js');

exports.commands = function(url){
    _OTCommands = new __OTCommands();
    _OTCommands._OTConfig = new __OTConfig(url);
    return _OTCommands;
};
