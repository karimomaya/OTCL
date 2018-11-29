#!/usr/bin/env node
let program = require('commander');
let __FileSystem    = require('fs');
let __OTCompiler     = require("./engine/__OTCompiler.js");
let fs = require('fs');

program
  .version('1.0.0')
  .option('-s, --server <url>','OT server URL','http://localhost/')
  .description('Opentext command-line interface');

program
  .command('run <script-file>')
  .alias('r')
  .description('run script file')
  .action((filename) => {
        __FileSystem.readFile(filename, (err, data) => {
            if (err) throw err;
            __OTCompiler().evaluator(data.toString());
         });
    
  });

program
  .command('compile <script-file> <out-js-file>')
  .alias('c')
  .description('compile script file to js')
  .action((filename,jsfilename) => {
        __FileSystem.readFile(filename, (err, data) => {
            if (err) throw err;

      js = "#!/usr/bin/env node \n\
            var _OTCL = require('otcl');\n\
            var _OTCommands = _OTCL.commands('"+program.server+"');\n\n";

	    js += __OTCompiler().translator(data.toString());
  
            fs.writeFile(jsfilename, js,function(err, data){
               if (err) console.log(err);
              console.log("Successfully Written to File.");
            });

            fs.chmod(jsfilename, '755');
         });
    
  });

  program.parse(process.argv);
