#!/usr/bin/env node
let program = require('commander');
let __FileSystem    = require('fs');
let __OTCompiler     = require("./engine/__OTCompiler.js");
let fs = require('fs');

program
  .version('0.0.1')
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
            js = __OTCompiler().translator(data.toString());

  
            fs.writeFileSync(jsfilename, js,function(err, data){
               if (err) console.log(err);
              console.log("Successfully Written to File.");
            });
         });
    
  });

  program.parse(process.argv);