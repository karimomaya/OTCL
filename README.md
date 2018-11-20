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
1- <code>create document %name% , %parent id% , %document file system% </code> <br>
2- <code>create folder %name% , %parent id% </code> <br>
3- <code>create news %name%, %parent id%</code> <br>
4- <code>create project %name%, %parent id%</code> <br>
5- <code>create shortcut %name%, %parent id%</code> <br>
6- <code>create task %name%, %parent id%</code> <br>
7- <code>create task_group %name%, %parent id%</code> <br>
8- <code>create task_list %name%, %parent id%</code> <br>
9- <code>create task_milistone %name%, %parent id%</code> <br>
#### Declare Categories
1- create folder called config under the project path <br>
2- inside config folder create a file with extension .cat <br>
3- make your category look like this <br>
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
* <code>create category %name% , %parent id% , %name of the declaration catergory without extension% </code> <br>
#### set category
* <code> set category %node id% , %category id% </code> <br>
#### Declare permission
1- <code> create folder called config under the project path </code> <br>
2- <code> inside config folder create a file with extension .per </code> <br>
3- <code> make your permission look like this </code> <br>
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
* <code> set permission %node id% , %name of the declaration permission without extension% </code> <br>
#### Write native Javascript code
<code> <% for(var i=0; i< 10; i++){ %> create folder %name% , %parent id <%} %> </code>

### Examples 
```js
auth username password 
$cat = create category cat, 5961, categoryConfiguration // note that the variable cat hold the id of the category 
$folder = create folder name, 5961
set category folder, cat // now you set the category you just created to the folder you just created :) 
$parentID = 5961
$x = 0
<% for(var i=0; i< 10; i++){ %> 
$x = create folder x , parentID 
<%} %>
```

