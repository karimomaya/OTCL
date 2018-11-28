let __Path          = require('path');
let __FileSystem    = require('fs');
let __Peg           = require("pegjs");
let __OTCommands    = require('./__OTCommands.js');


function __OTCompiler() {
   global.__OTVARIABLES = [];

    return {
        translator : translator,
        evaluator: evaluator,
        convertor : convertor
    }

    function convertor(){
        translator("auth admin Asset99a");
        var _OTCommands = new __OTCommands();
        var path = (__Path.resolve(__dirname, "../config/")).toString();
        var fs = require('fs');
        fs.readdir(path, function(err, items) {
         
            for (var i=0; i<items.length; i++) {
                if(items[i].indexOf(".per") == -1) continue;

                var values=cleanXML(fs.readFileSync("config/"+items[i], "utf8")).permissions;
                values = values.permission;
                var xmlContent = '<?xml version="1.0" encoding="UTF-8"?><permissions>';
                var _OTCommands = new __OTCommands();
                console.log(values);
                for(var index in values){
                    xmlContent += '<permission>';
                    var type = (values[index].type == "user")?0 : 1;
                    xmlContent += '<type>'+type+'</type>';
                    xmlContent += '<name>'+_OTCommands.search_users_roles(type, values[index].name)+'</name>';
                    xmlContent += '<access>'+values[index].access+'</access>';
                    xmlContent += '</permission>';
                }
                xmlContent += '</permissions>';
                fs.writeFileSync("config/"+items[i]+".compiled",xmlContent,function(err, data){
                    if (err) console.error(err);
                    console.log("Successfully Written to File.");
                });
            }

           
        });
    }

    function cleanXML(message){
        var fastXmlParser = require('fast-xml-parser');
		var jsonObj = fastXmlParser.parse(message);
		return jsonObj;
    }

    function translator(__otcl) {
        var grammar = __FileSystem.readFileSync(__Path.resolve(__dirname, "../grammer.pegjs")).toString();
        var parser  = __Peg.generate(grammar);
        
        console.log(__otcl);

        js = parser.parse(__otcl);
        return js;
    }

    function evaluator(__otcl) {
        
        var js = 
        "let __OTCommands    = require('./__OTCommands.js');\n"+
        "var _OTCommands     = new __OTCommands();\n";
        
        js += translator(__otcl);

        eval(js);
    }
}
module.exports = __OTCompiler;