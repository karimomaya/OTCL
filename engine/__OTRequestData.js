class __OTRequestData {
	
	setURL(url){
		this.url = url;
	}
	setSoapAction(soapAction){
		this.soapAction = soapAction;
	}
	setValues(values) {
		this.values = values;
	}
	setToken(token){
		this.token = token;
	}
	setMethod(method){
		this.method = method;
	}
	setContentType(contentType) {
		this.contentType = contentType;
	}
	setType(type){
		this.type = type;
	}
	setReturn(returnData){
		this.return = returnData;
	}
	setAction(action){
		this.action = action;
	}
	setCompiler(compiler){
		this.compiler = compiler;
	}

}
module.exports = __OTRequestData;
