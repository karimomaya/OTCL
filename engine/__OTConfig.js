
class __OTConfig  {
    constructor(domain="http://localhost/"){
        this.__OTDOMAIN      = domain;
        this.__OTWSDLURL     = this.__OTDOMAIN +"cws/DocumentManagement.svc?wsdl";
        this.__OTCSURL       = this.__OTDOMAIN +"otcs/cs.exe/";
        this.__OTXMLAUTHURL  = this.__OTDOMAIN+ "cws/Authentication.svc?wsdl";
        this.__OTTypes       =  { "folder": 0, "shortcut": 1, "category": 131, "compound document": 136, "url" : 140, "document": 144, 
        "project": 202, "task list": 204, "task group": 205, "task": 206, "channel": 207, "news": 208, "task milistone": 212,
        "virtual_folder": 899 };
    }
    
}
module.exports = __OTConfig;
