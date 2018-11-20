# OTCL
OpenText Command Line it's an open source library helping to configure their OT content server environment using only command lines. The main advantage of OTCL is to write (your configuration) once and deploy everywhere.
## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.
Pull the repo onto your localmachine
open cmd and type node server.js
access the application from http://localhost:3001/
voila everything is working enjoy configure you application using simple commands line. for help you can press on the icon ? from the top right corner
## Deployment
open engine folder and change the configuration of your Content server from __OTConfig.js
### Simple Commands 
#### Authentication to Content Server
auth %username% %password%
#### Create Nodes
1- <code>create document %name% , %parent id% , %document file system% </code>
2- create folder %name% , %parent id%
3- create news %name%, %parent id%
4- create project %name%, %parent id%
5- create shortcut %name%, %parent id%
6- create task %name%, %parent id%
7- create task_group %name%, %parent id%
8- create task_list %name%, %parent id%
9- create task_milistone %name%, %parent id%
#### Declare Categories
1- create folder called config under the project path 
2- inside config folder create a file with extension .cat
3- make your category look like this
```xml
<?xml version="1.0" encoding="UTF-8"?>
<categories>
	<category>
		<name>first name</name>
		<type>string</type>
	</category>
	<category>
		<name>last name</name>
		<type>string</type>
	</category>
</categories>
```
#### Create Categories
* create category   %name% , %parent id% , %name of the declaration catergory without extension%
#### set category
* set category %node id% , %category id%
#### Declare permission
1- create folder called config under the project path 
2- inside config folder create a file with extension .per
3- make your permission look like this
```xml
<?xml version="1.0" encoding="UTF-8"?>
<permissions>
	<permission>
		<type>user</type>
		<name>username</name>
		<access>see</access>
	</permission>
	<permission>
		<type>group</type>
		<name>groupname</name>
		<access>see</access>
	</permission>
</permissions>
```
#### set permission
* set permission %node id% , %name of the declaration permission without extension%
#### Write native Javascript code
&lt;% for(var i=0; i &lt; 10; i++){ %&gt;   create folder %name% , %parent id% <br>&lt;%} %&gt; </span><br>

### Examples 
auth username password 
$cat = create category cat, 5961, categoryConfiguration // note that the variable cat hold the id of the category 
$folder = create folder name, 5961
set category folder, cat // now you set the category you just created to the folder you just created :) 
$parentID = 5961
$x = 0
&lt;% for(var i=x; i &lt; 10; i++){ %&gt;
$x = create folder x , parentID 
&lt;%} %&gt; </span><br>


