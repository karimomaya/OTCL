File
	= head:Expression tail:(Expression)* {
      return tail.reduce(function(result, element){
      		return result + element;
      	}
      ,head);
    }

Expression 
	= _ exp:(JSExpression / OTExpression / NLine / Comment) _ {return exp;}

JSExpression
	= "<%" code:JSCode "%>" {return code;}
    
OTExpression
	= left:OTLExpression _ "=" _ right:OTRExpression { return left + " = " + right + ";\n";}
    / right:OTRExpression {return right+";";}
    
OTLExpression
	= "$" [a-zA-Z]+ {return "var " + text().replace("$", "")}
    
OTRExpression
	= OTCreate/OTOpen/OTAuth/OTSet/OTGet/OTVariable
    
OTVariable = "$" [a-zA-Z]+ {return text().replace("$", "") }
 			/ [a-zA-Z0-9]+ {return text()}
            
OTGet = "get" url:[ \t,+a-zA-Z0-9$\/:\.\\'_"]* {return "_OTCommands.get_node_by_path("+url.join('')+")";}

OTSet = "set" _ obj:("category"/"permission") _ url:[ \t,+a-zA-Z0-9$\/:\.\\'"]+ {return "_OTCommands.set_"+obj+ "("+url.join('')+")";}

OTOpen
	= "open" _ obj:("folder"/"file") _ url:[a-zA-Z0-9\/:\.]* {return "open_"+obj+"(__session, '"+url.join('')+"')";}
  
OTCreate
	= "create" _ obj:("folder"/"document"/"category") _ url:[ \t,+a-zA-Z0-9$\/:\.\\'_"]* {return (obj == "document")?"_OTCommands.create_"+obj+"(" +url.join('').replace("$","")+")": (obj == "category")? "_OTCommands.create_"+obj+"(" +url.join('')+")": "_OTCommands.create"+"('"+obj +"'," +url.join('')+")";}

OTAuth
	= "auth" _ uname:[^ \t]+ _ password:[^ \t\r\n]+ { return "__OTVARIABLES['token'] = _OTCommands.auth('"+uname.join('')+"', '"+password.join('')+"');"+"__OTVARIABLES['xmltoken'] = _OTCommands.auth('"+uname.join('')+"', '"+password.join('')+"', 'xml')" }

    
    
JSCode
	= [^%]* { return text();}
    
_ "whitespace"
    = [ \t]* {return "";}
  
NLine
	= [\r\n]+ {return "\n";}

Comment
	= "//" [^\n]* { return text();}