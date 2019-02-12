let __OTRequestData = require('./__OTRequestData.js');
let __OTPostRequest = require('./__OTPostRequest.js');
let __OTConfig      = require('./__OTConfig.js');

global.__OTVARIABLES = [];

class __OTCommands {

    constructor() {
        this._OTConfig = new __OTConfig();
    }
	authxml(username, password){
		return this._auth(username, password,'xml');
	}
    auth(username, password){
        return this._auth(username, password);
        
    }

    _auth(username, password, xml){
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

        __OTVARIABLES["owner"] = username;

        return this.post(_OTRequestData);
    }

    create(type,name, parent_id){

        var _OTRequestData = new __OTRequestData();
        if(!parent_id) parent_id = 2000;
        
        if(isNaN(parent_id)) 
            parent_id = this.get_node_by_path(parent_id);
        
        
        var url = this._OTConfig.__OTCSURL+'api/v2/nodes/';
        _OTRequestData.setURL(url);
        _OTRequestData.setContentType("form");

        var values = 'parent_id='+parent_id+'&type='+this._OTConfig.__OTTypes[type]+'&name='+name;

        _OTRequestData.setToken(__OTVARIABLES["token"]);
        _OTRequestData.setValues(values);
        _OTRequestData.setMethod("POST");

        return this.post(_OTRequestData);
    }
	
	

    get_node_by_path(path){
        
        var value = this.get_node_by_path_message(__OTVARIABLES["xmltoken"], path.split("/"));
        var _OTRequestData = new __OTRequestData();
        _OTRequestData.setURL(this._OTConfig.__OTWSDLURL);
        _OTRequestData.setContentType("xml");
        _OTRequestData.setMethod("POST");
        _OTRequestData.setValues(value);
        _OTRequestData.setToken(__OTVARIABLES["xmltoken"]);
        _OTRequestData.setReturn("xml.properties.id");
        _OTRequestData.setSoapAction("GetNodeByPath");
        return this.post(_OTRequestData);

    }
	
	delete_by_id(id){
		var _OTRequestData = new __OTRequestData();
        var url = this._OTConfig.__OTCSURL+'api/v2/nodes/'+id;
        _OTRequestData.setURL(url);
        _OTRequestData.setContentType("application/json");
        
        _OTRequestData.setToken(__OTVARIABLES["token"]);
        _OTRequestData.setMethod("DELETE");

        return this.post(_OTRequestData);
	}
	
	get_sub_nodes(id){
		
		
		var _OTRequestData = new __OTRequestData();
        var url = this._OTConfig.__OTCSURL+'api/v2/nodes/'+id +'/nodes';
        _OTRequestData.setURL(url);
        _OTRequestData.setContentType("application/json");
        
        _OTRequestData.setToken(__OTVARIABLES["token"]);
        _OTRequestData.setMethod("GET");

        return this.post(_OTRequestData);
		
	}

    search_users_roles(type, name){
        // 0 for user 1 for groups
        var _OTRequestData = new __OTRequestData();
        var values = 'where_type='+type+'&query='+name;
        var url = this._OTConfig.__OTCSURL+'api/v2/members?'+values;
        _OTRequestData.setURL(url);
        _OTRequestData.setContentType("form");
        
        _OTRequestData.setToken(__OTVARIABLES["token"]);
        _OTRequestData.setMethod("GET");
        _OTRequestData.setReturn("search.id");

		_OTRequestData.setSearchedValue(name);
        return this.post(_OTRequestData);
    }

    set_permission(node_id, per_file_name){
        var _OTRequestData = new __OTRequestData();

        var fs = require("fs");
        var values=this.cleanXML(fs.readFileSync(per_file_name, "utf8")).permissions.permission;

        _OTRequestData.setURL(this._OTConfig.__OTWSDLURL);
        _OTRequestData.setContentType("xml");
        _OTRequestData.setMethod("POST");
        _OTRequestData.setToken(__OTVARIABLES["xmltoken"]);
        _OTRequestData.setSoapAction("SetNodeRights");
        var right = "";
        var hasPublic = false;
        var hasOnwer = false;
        for(var index in values){
            var beginWith =  '<ns3:ACLRights>';
            var endWith = '<ns3:Type>ACL</ns3:Type></ns3:ACLRights>';
            var userID = -1;
            switch(values[index].type){
                case "owner":
                    hasOnwer = true;
                    beginWith =  '<ns3:OwnerRight>';
                    endWith = '<ns3:Type>Owner</ns3:Type></ns3:OwnerRight>';
                    userID = this.search_users_roles(0, __OTVARIABLES["owner"]);
                    break;
                case "public":
                    hasPublic = true;
                    userID = -1;
                    beginWith =  '<ns3:PublicRight>';
                    endWith = '<ns3:Type>Public</ns3:Type></ns3:PublicRight>';
                    break;
                case "ownergroup":
                    userID = this.search_users_roles(1, values[index].name);
                    beginWith =  '<ns3:OwnerGroupRight>';
                    endWith = '<ns3:Type>OwnerGroup</ns3:Type></ns3:OwnerGroupRight>';
                    break;
                default:
                    var type = (values[index].type == "user")?0 : 1;
                    userID = this.search_users_roles(type, values[index].name);
                    break;
            }
            var permissions = values[index].access.split(",");
            right +=  this.config_permissions_message(permissions, userID, beginWith, endWith) ;
            
        }
        if(!hasPublic){
            beginWith =  '<ns3:PublicRight>';
            endWith = '<ns3:Type>Public</ns3:Type></ns3:PublicRight>';
            right += this.config_permissions_message([], -1, beginWith, endWith) ;
        }
        if(!hasOnwer){
            var userID = this.search_users_roles(0, __OTVARIABLES["owner"]);
            beginWith =  '<ns3:OwnerRight>';
            endWith = '<ns3:Type>Owner</ns3:Type></ns3:OwnerRight>';
            right += this.config_permissions_message([], userID,  beginWith, endWith) ;
        }

        _OTRequestData.setValues(this.set_permission_message(right, node_id));
        return this.post(_OTRequestData);
    }

    set_category(node_id, category_id){
        var _OTRequestData = new __OTRequestData();
        if(isNaN(node_id)) {
            _OTRequestData.setError("Invalid node id " + node_id);
            return _OTRequestData;
        }
        if(isNaN(category_id)) {
            _OTRequestData.setError("Invalid category id " + category_id);
            return _OTRequestData;
        }

        var url = this._OTConfig.__OTCSURL+'api/v2/nodes/'+node_id+"/categories";
        _OTRequestData.setURL(url);
        _OTRequestData.setContentType("form");

        // api/v1/nodes/{id}/categories
        var values = 'category_id='+category_id;

        _OTRequestData.setToken(__OTVARIABLES["token"]);
        _OTRequestData.setValues(values);
        _OTRequestData.setMethod("POST");

        return this.post(_OTRequestData);

    }

    create_category(name, parent_id, cat_file_name){

        var fs = require("fs");
        var value=this.cleanXML(fs.readFileSync(cat_file_name, "utf8")).categories;
        console.log(value);

        var _OTRequestData = new __OTRequestData();

        if(isNaN(parent_id)) {
            _OTRequestData.setError("Invalid parent id " + parent_id);
            return _OTRequestData;
        }

        _OTRequestData.setURL(this._OTConfig.__OTWSDLURL);
        _OTRequestData.setContentType("xml");
        _OTRequestData.setSoapAction("CreateCategory");

        value = this.create_category_message(parent_id, name, value.category);

        _OTRequestData.setToken(__OTVARIABLES["xmltoken"]);
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

    handle_permissions_bitwise(permissions){
        var result = 0;
        for (var i=0; i< permissions.length; i++){
            switch (permissions[i].toLowerCase().trim()){
                case "add":
                    result = result | 256; //100000000
                    break;
                case "delete":
                    result = result | 128; // 010000000
                    break;
                case "deleteversions":
                    result = result | 64; // 001000000
                    break;
                case "edit":
                    result = result | 32;//000100000
                    break;
                case "editpermissions":
                    result = result | 16;
                    break;
                case "modify":
                    result = result | 8;
                    break;
                case "reserve":
                    result = result | 4;
                    break;
                case "see":
                    result = result | 1;
                    break;
                case "seecontent":
                    result = result | 2;
                    break;
                default: 
                    result = result;
            }
        }
        return result;
    }
	
	 get_node_by_path_message(token, pathes){
        var soap =  "<?xml version=\"1.0\" ?><S:Envelope xmlns:S=\"http://schemas.xmlsoap.org/soap/envelope/\">"+
        "<S:Header><OTAuthentication xmlns=\"urn:api.ecm.opentext.com\"><AuthenticationToken>"+token+"</AuthenticationToken></OTAuthentication>"+
        "</S:Header><S:Body><ns3:GetNodeByPath xmlns=\"urn:api.ecm.opentext.com\" "+
        "xmlns:ns2=\"urn:Core.service.livelink.opentext.com\" xmlns:ns3=\"urn:DocMan.service.livelink.opentext.com\">"+
        "<ns3:rootID>2000</ns3:rootID>";
        var path = null;
        while( path = pathes.shift() ){
            soap += "<ns3:pathElements>"+path+"</ns3:pathElements>";
        }
        soap += "</ns3:GetNodeByPath></S:Body></S:Envelope>";
        return soap;
    }

    config_permissions_message(permissions, userId, beginWith, endWith){
        var soap = beginWith;
        var result = this.handle_permissions_bitwise(permissions);
        soap +=   '<ns3:Permissions>'+
            '<ns3:AddItemsPermission>'+this.compute_bitwise(result, 256)+'</ns3:AddItemsPermission>'+
            '<ns3:DeletePermission>'+this.compute_bitwise(result, 128)+'</ns3:DeletePermission>'+
            '<ns3:DeleteVersionsPermission>'+this.compute_bitwise(result, 64)+'</ns3:DeleteVersionsPermission>'+
            '<ns3:EditAttributesPermission>'+this.compute_bitwise(result, 32)+'</ns3:EditAttributesPermission>'+
            '<ns3:EditPermissionsPermission>'+this.compute_bitwise(result, 16)+'</ns3:EditPermissionsPermission>'+
            '<ns3:ModifyPermission>'+this.compute_bitwise(result, 8)+'</ns3:ModifyPermission>'+
            '<ns3:ReservePermission>'+this.compute_bitwise(result, 4)+'</ns3:ReservePermission>'+
            '<ns3:SeeContentsPermission>'+this.compute_bitwise(result, 2)+'</ns3:SeeContentsPermission>'+
            '<ns3:SeePermission>'+this.compute_bitwise(result, 1)+'</ns3:SeePermission>'+
        '</ns3:Permissions>'+
        '<ns3:RightID>'+userId+'</ns3:RightID>';
        soap += endWith;
        return soap;
    }

    compute_bitwise(result, id) {
        return (result & id)? true: false;
    }
    

    set_permission_message(right, node_id){
        return '<?xml version="1.0" ?><S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/">'+
        '<S:Header>'+
        '<OTAuthentication xmlns="urn:api.ecm.opentext.com">'+
            '<AuthenticationToken>'+__OTVARIABLES["xmltoken"]+'</AuthenticationToken>'+
        '</OTAuthentication>'+
        '</S:Header>'+
        '<S:Body>'+
        '<ns3:SetNodeRights xmlns="urn:api.ecm.opentext.com" xmlns:ns2="urn:Core.service.livelink.opentext.com" xmlns:ns3="urn:DocMan.service.livelink.opentext.com">'+
            '<ns3:ID>'+node_id+'</ns3:ID>'+
            '<ns3:rights>'+
                right+
            '</ns3:rights>'+
        '</ns3:SetNodeRights>'+
        '</S:Body></S:Envelope>';
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
            console.log(typeof values[index].maxValues);
            soap += '<ns3:attributes xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="'+this.getAttributeType(values[index].type)+'">'+
            '<ns3:DisplayName>'+values[index].name+'</ns3:DisplayName>'+
            '<ns3:ID>0</ns3:ID>'+
            '<ns3:MaxValues>'+this.return_expected(values[index].maxValues,1)  + '</ns3:MaxValues>'+
            '<ns3:MinValues>'+this.return_expected(values[index].minValues,1)   +'</ns3:MinValues>'+
            '<ns3:ReadOnly><ns2:Value>'+this.return_expected(values[index].readOnly, false) +'</ns2:Value></ns3:ReadOnly>'+
            '<ns3:Required>'+this.return_expected(values[index].required, false) +'</ns3:Required>'+
            '<ns3:Searchable>'+this.return_expected(values[index].searchable,true)  +'</ns3:Searchable>'+
            '<ns3:DisplayLength>'+this.return_expected(values[index].displayLength,64) +'</ns3:DisplayLength>'+
            '<ns3:MaxLength>'+this.return_expected(values[index].MaxLength,64) +'</ns3:MaxLength>';
            if (values[index].type == "date")
                soap += '<ns3:ShowTime>'+this.return_expected(values[index].showTime, true)+'</ns3:ShowTime>';
            soap += '</ns3:attributes>';
        }
        
        soap += '</ns3:CreateCategory></S:Body></S:Envelope>';
        console.log(soap);
        return soap;
    }

    return_expected(value, expected){
        return (typeof value == "undefined")? expected : value;
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
