var request = require('sync-request');
function __OTPostRequest(__OTRequestData) {
	__OTRequestData = __OTRequestData;
	__OTRequestData.method = __OTRequestData.method || "POST";
	__OTRequestData.values = __OTRequestData.values || "";
	__OTRequestData.token = __OTRequestData.token || null;

	return {
		post : post
	}
	function post(){
		var headers = {
			'Content-Type': setContentType(),
			'SOAPAction': setSoapAction(),
			'otcsticket': __OTRequestData.token
		};
		var options = {
			headers: headers,
		}

		if(__OTRequestData.method != "GET"){
			options.body = __OTRequestData.values
		}

		var res = request(__OTRequestData.method, __OTRequestData.url, options);
		res = res.body.toString('utf-8');

		return getReturn(res, __OTRequestData);
	}

	function getReturn(body, __OTRequestData){
        switch(__OTRequestData.return){
			case "auth.ticket":
				console.log(JSON.parse(body).ticket);
                return JSON.parse(body).ticket;
            case "auth.xml.ticket":
                return cleanXML(body)["s:Envelope"]["s:Body"].AuthenticateUserResponse.AuthenticateUserResult;
            case "properties.id":
				return JSON.parse(body).results.data.properties.id;
			case "search.id":
				return JSON.parse(body).results[0].data.properties.id;
			default:
				result = null;
				if(__OTRequestData.contentType == "xml"){
					result = cleanXML(body);
					result = result["s:Envelope"]["s:Body"];
					if(result["s:Fault"]){
						console.log( result["s:Fault"].faultstring);
						result = null;
					}
					else if(result["CreateCategoryResponse"]){
						result = result["CreateCategoryResponse"].CreateCategoryResult.ID
					}
					else if(result["CreateDocumentResponse"]) {
						result = result["CreateDocumentResponse"].CreateDocumentResult.ID
					}
					else {
						console.log(result);
						result = null;
					}
				}
				else {
					var data = JSON.parse(body).results.data;
					if(typeof data == "undefined") return null;
					if(typeof data.properties =="undefined") return null;
					result = data.properties.id;
				}
				return result;
        }

	}
	
    function cleanXML(message){
        var fastXmlParser = require('fast-xml-parser');
		var jsonObj = fastXmlParser.parse(message);
		return jsonObj;
    }

	function setSoapAction(){
		switch(__OTRequestData.soapAction) {
			case "CreateCategory":
				return "urn:DocMan.service.livelink.opentext.com/CreateCategory";
			case "Authentication": 
				return "urn:Core.service.livelink.opentext.com/AuthenticateUser";
			case "CreateDocument":
				return "urn:DocMan.service.livelink.opentext.com/CreateDocument";
			case "SetNodeRights":
				return "urn:DocMan.service.livelink.opentext.com/SetNodeRights"
			default: 
				return "";
		}
	}

	function setContentType(){
		switch(__OTRequestData.contentType){
			case "form":
				return "application/x-www-form-urlencoded";
			case "json":
				return "text/json";
			case "xml":
				return 'text/xml;charset=UTF-8';
			default: 
				return "text/json";
		}
	}
}
module.exports = __OTPostRequest;
