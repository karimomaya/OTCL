let __OTRequestData = require('./__OTRequestData.js');
let __OTPostRequest = require('./__OTPostRequest.js');
let __OTConfig      = require('./__OTConfig.js');
class __OTCommands {

    constructor() {
        this._OTConfig = new __OTConfig();
    }

    auth(username, password, xml){
        xml = xml || false;
        var _OTRequestData = new __OTRequestData();
        _OTRequestData.setMethod("POST");

        var url = (xml)? this._OTConfig.__OTXMLAUTHURL :this._OTConfig.__OTCSURL+'api/v1/auth/';
        var type = (xml)? "xml": "form";
        var values = (xml)? this.createAuthenticationMessage(username, password) : 'username='+username+'&password='+password;
        
        var propertyValue = (xml)? "auth.xml.ticket" : "auth.ticket";
        _OTRequestData.setReturn(propertyValue);
        
        if (xml) _OTRequestData.setSoapAction("Authentication");
        _OTRequestData.setURL(url);
        _OTRequestData.setContentType(type);
        _OTRequestData.setValues(values);

        return this.post(_OTRequestData);
    }

    create(type,name, parent_id){

        var _OTRequestData = new __OTRequestData();

        if(isNaN(parent_id)) {
            _OTRequestData.setError("Invalid parent id " + parent_id);
            return _OTRequestData;
        }
        
        var url = this._OTConfig.__OTCSURL+'api/v2/nodes/';
        _OTRequestData.setURL(url);
        _OTRequestData.setContentType("form");

        var values = 'parent_id='+parent_id+'&type='+this._OTConfig.__OTTypes[type]+'&name='+name;

        _OTRequestData.setToken(__OTVARIABLES["token"]);
        _OTRequestData.setValues(values);
        _OTRequestData.setMethod("POST");

        return this.post(_OTRequestData);
    }

    create_category(name, parent_id, path){

        var fs = require("fs");
        var value=this.cleanXML(fs.readFileSync("config/"+path+".cat", "utf8")).category;
        console.log(value);

        var _OTRequestData = new __OTRequestData();

        if(isNaN(parent_id)) {
            _OTRequestData.setError("Invalid parent id " + parent_id);
            return _OTRequestData;
        }

        _OTRequestData.setURL(this._OTConfig.__OTWSDLURL);
        _OTRequestData.setContentType("xml");
        _OTRequestData.setSoapAction("CreateCategory");

        value = this.create_category_message(parent_id, name, value);

        _OTRequestData.setToken(__OTVARIABLES["token"]);
        _OTRequestData.setValues(value);
        _OTRequestData.setMethod("POST");

        return this.post(_OTRequestData);
    }

    cleanXML(message){
        var fastXmlParser = require('fast-xml-parser');
		var jsonObj = fastXmlParser.parse(message);
		return jsonObj;
    }

    create_document(name, parent_id, path){
        console.log(path);
        var fs = require("fs");

        var name = name;

        var _OTRequestData = new __OTRequestData();

        if(isNaN(parent_id)) {
            _OTRequestData.setError("Invalid parent id " + parent_id);
            return _OTRequestData;
        }

        _OTRequestData.setURL(this._OTConfig.__OTWSDLURL);
        _OTRequestData.setContentType("xml");
        _OTRequestData.setSoapAction("CreateDocument");
        

        var contents = this.base64_encode(path);
        const fileSizeInBytes = fs.statSync(path).size;

        var values = this.create_document_message(parent_id, name, contents, fileSizeInBytes);

        _OTRequestData.setToken(__OTVARIABLES["xmltoken"]);
        _OTRequestData.setValues(values);
        _OTRequestData.setMethod("POST");

        return this.post(_OTRequestData);
    }

    base64_encode(file) {
        var fs = require("fs");
        return new Buffer(fs.readFileSync(file)).toString('base64');
    }

    post(_OTRequestData){
        var request = __OTPostRequest(_OTRequestData);
        return request.post();
    }

    getAttributeType(type) {
		switch(type){
			case 'string':
				return 'ns3:StringAttribute';
			case 'int':
				return 'ns3:IntegerAttribute';
			case 'date':
				return 'ns3:DateAttribute';
			default:
				throw `invalid attribute: ${type}`;
		}
	}


    create_category_message(parentId, name, values){
        var soap = 
        '<?xml version="1.0" ?><S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/"><S:Header>'+
        '<OTAuthentication xmlns="urn:api.ecm.opentext.com">'+
        '<AuthenticationToken>'+__OTVARIABLES["xmltoken"]+'</AuthenticationToken>'+
        '</OTAuthentication>'+
        '</S:Header><S:Body>'+
        '<ns3:CreateCategory xmlns="urn:api.ecm.opentext.com" xmlns:ns2="urn:Core.service.livelink.opentext.com" xmlns:ns3="urn:DocMan.service.livelink.opentext.com">'+
        '<ns3:parentID>'+parentId+'</ns3:parentID>'+
        '<ns3:name>'+name+'</ns3:name>';

        for(var index in values){
            soap += '<ns3:attributes xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="'+this.getAttributeType(values[index].type)+'">'+
            '<ns3:DisplayName>'+values[index].displayName+'</ns3:DisplayName>'+
            '<ns3:ID>0</ns3:ID>'+
            '<ns3:MaxValues>'+values[index].maxValues || 1+'</ns3:MaxValues>'+
            '<ns3:MinValues>'+values[index].minValues || 1+'</ns3:MinValues>'+
            '<ns3:ReadOnly><ns2:Value>'+values[index].readOnly || false+'</ns2:Value></ns3:ReadOnly>'+
            '<ns3:Required>'+values[index].required || false+'</ns3:Required>'+
            '<ns3:Searchable>'+values[index].searchable || true+'</ns3:Searchable>'+
            '<ns3:DisplayLength>'+values[index].displayLength || 64+'</ns3:DisplayLength>'+
            '<ns3:MaxLength>'+values[index].MaxLength || 64+'</ns3:MaxLength>';
            if (values[index].type == "date")
                soap += '<ns3:ShowTime>'+values[index].showTime || true+'</ns3:ShowTime>';
            soap += '</ns3:attributes>';
        }
        
        soap += '</ns3:CreateCategory></S:Body></S:Envelope>';
        return soap;
    }

    create_document_message(parent_id, name, content, size){
        return '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:api.ecm.opentext.com" xmlns:urn1="urn:DocMan.service.livelink.opentext.com" xmlns:urn2="urn:Core.service.livelink.opentext.com">'+
        '<soapenv:Header><urn:OTAuthentication><urn:AuthenticationToken>'+__OTVARIABLES["xmltoken"]+'</urn:AuthenticationToken>'+
        '</urn:OTAuthentication></soapenv:Header><soapenv:Body><urn1:CreateDocument><urn1:parentID>'+parent_id+'</urn1:parentID>'+
        '<urn1:name>'+name+'</urn1:name><urn1:attach><urn2:CreatedDate>2018-07-31Z</urn2:CreatedDate>'+
        '<urn2:FileName>'+name+'</urn2:FileName>'+
        '<urn2:FileSize>'+size+'</urn2:FileSize>'+
        '<urn2:ModifiedDate>2018-07-31Z</urn2:ModifiedDate>'+
        '<urn2:Contents>'+content+'</urn2:Contents>'+
        '</urn1:attach></urn1:CreateDocument></soapenv:Body></soapenv:Envelope>';
    }

    createAuthenticationMessage(username, password){
        return '<?xml version="1.0" ?><S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/"><S:Body>'+
        '<ns2:AuthenticateUser xmlns="urn:api.ecm.opentext.com" xmlns:ns2="urn:Core.service.livelink.opentext.com">'+
        '<ns2:userName>'+username+'</ns2:userName><ns2:userPassword>'+password+'</ns2:userPassword></ns2:AuthenticateUser>'+
        '</S:Body></S:Envelope>';
    }
}
module.exports = __OTCommands;