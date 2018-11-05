let __OTCommands    = require('./__OTCommands.js');var _OTCommands     = new __OTCommands();__OTVARIABLES['token'] = _OTCommands.auth('haitham', 'a');__OTVARIABLES['xmltoken'] = _OTCommands.auth('haitham', 'a', 'xml');
var x = 59523;

for (var i =0;  i <3; i++){

var x = _OTCommands.create('folder',"ahmedFolder"+i, x);

};;
;
