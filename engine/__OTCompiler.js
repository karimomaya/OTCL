let __Path          = require('path');
let __FileSystem    = require('fs');
let __Peg           = require("pegjs");


function __OTCompiler() {
   global.__OTVARIABLES = [];

    return {
        translator : translator
    }

    function translator(__otcl) {
        var grammar = __FileSystem.readFileSync(__Path.resolve(__dirname, "../grammer.pegjs")).toString();
        var parser  = __Peg.generate(grammar);
        
        console.log(__otcl);

        var js = 
        "let __OTCommands    = require('./__OTCommands.js');"+
        "var _OTCommands     = new __OTCommands();"

        js += parser.parse(__otcl);

        var fs = require('fs');

        fs.appendFileSync('temp.js', js+ ";\r\n",function(err, data){
            if (err) console.log(err);
            console.log("Successfully Written to File.");
        });
        // eval(js);
        console.log("done");
    }
    
}
module.exports = __OTCompiler;