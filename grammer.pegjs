File
	= head:Expression tail:(Expression)* {
      return tail.reduce(function(result, element){
      		return result + element;
      	}
      ,head);
    }

Expression 
	= _ exp:(JSExpression / OTExpression / NLine) _ {return exp;}

JSExpression
	= "<%" code:JSCode "%>" {return code;}
    
OTExpression
	= left:OTLExpression _ "=" _ right:OTRExpression { return left + " = " + right + ";";}
    / right:OTRExpression {return right+";";}
    
OTLExpression
	= "$" [a-zA-Z]+ {return "var " + text().replace("$", "")}
    
OTRExpression
	= OTCreate/OTOpen/OTAuth/OTLogout/OTVariable
    
 OTVariable = "$" [a-zA-Z]+ {return text().replace("$", "") }
 			/ [a-zA-Z0-9]+ {return text()}
    
OTOpen
	= "open" _ obj:("folder"/"file") _ url:[a-zA-Z0-9\/:\.]* {return "open_"+obj+"(__session, '"+url.join('')+"')";}
  
OTCreate
	= "create" _ obj:("folder"/"document"/"category") _ url:[ \t,+a-zA-Z0-9$\/:\.\\'"]* {return (obj == "document")?"_OTCommands.create_"+obj+"(" +url.join('').replace("$","")+")": (obj == "category")? "_OTCommands.create_"+obj+"(" +url.join('')+")": "_OTCommands.create"+"('"+obj +"'," +url.join('')+")";}

OTAuth
	= "auth" _ uname:[^ \t]+ _ password:[^ \t\r\n]+ { return "__OTVARIABLES['token'] = _OTCommands.auth('"+uname.join('')+"', '"+password.join('')+"');"+"__OTVARIABLES['xmltoken'] = _OTCommands.auth('"+uname.join('')+"', '"+password.join('')+"', 'xml')" }
    
OTLogout
	= "logout" {return "logout(__session)";}
    
JSCode
	= [^%]* { return text();}
    
_ "whitespace"
    = [ \t]* {return "";}
  
NLine
	= [\r\n]+ {return "\n";}