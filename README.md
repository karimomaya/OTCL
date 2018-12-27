# OTCL
OpenText Command Line it's not only a command line it's like programming language you can write our commands with native JavaScript code. this Tool is an open source tool for helping company to configure OT content server environment using some logic . The main advantage of OTCL is to write (your configuration) once and deploy everywhere.
## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.
Pull the repo onto your localmachine
open cmd and type node server.js
access the application from http://localhost:3001/
voila everything is working enjoy configure you application using simple commands line. for help you can press on the icon ? from the top right corner
## Deployment
<code>sudo npm install -g https://github.com/karimomaya/OTCL.git</code>

### OTCL Command line
<code>**ot-cli** [options] [command]

**Options:**
  -V, --version                          output the version number
  -s, --server \<url\>                     OT server URL (default: "http://localhost/")
  -h, --help                             output usage information

**Commands:**
  run|r \<script-file\>                    run script file
  compile|c \<script-file\> \<out-js-file\>  compile script file to js 
</code>

### Simple Commands 
#### Authentication to Content Server
<code>auth %username% %password%</code>
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
#### Get folder by path
* <code>$pathID = get %path% </code> <br>
#### Declare Categories
1- create folder called config under the project path <br>
2- inside config folder create a file with extension .cat <br>
3- make your category look like this <br>
```xml
<?xml version="1.0" encoding="UTF-8"?>
<categories>
	<category>
		<name>Serial Number</name>
		<type>int</type>
	</category>
	<category>
		<name>Author Name</name>
		<type>string</type>
	</category>
	<category>
		<name>Publish Date</name>
		<type>date</type>
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
3- <code> supported permissions add, delete, deleteversions, edit, editpermissions, modify, reserve, see, seecontent </code> <br>
4- <code> make your permission look like this </code> <br>
```xml
<?xml version="1.0" encoding="UTF-8"?>
<permissions>
	<permission>
		<type>user</type>
		<name>%username%</name>
		<access>%permission%</access>
	</permission>
	<permission>
		<type>group</type>
		<name>%group name%</name>
		<access>%permission%</access>
	</permission>
	<permission>
		<type>owner</type>
		<name>%owner name%</name>
		<access>%permission%</access>
	</permission>
	<permission>
		<type>ownergroup</type>
		<name>%owner group name%</name>
		<access>%permission%</access>
	</permission>
	<permission>
		<type>public</type>
		<access>%permission%</access>
	</permission>
</permissions>
```
* <b>Note: </b> if owner didn't set by default it will set the use that you authenticate with.
* <b>Note: </b> write you permissions with comman seperated.
#### set permission
* <code> set permission %node id% , %name of the declaration permission without extension% </code> <br>
#### Write native Javascript code
<code> <% for(var i=0; i< 10; i++){ %> create folder %name% , %parent id <%} %> </code>

### Examples 
```js
auth username password 
$cat = create category "category 1", 5961, "categoryConfiguration" // note that the variable cat hold the id of the category 
$folder = create folder "name", 5961
set category folder, cat // now you set the category you just created to the folder you just created :) 
$parentID = 5961
$x = 0
<% for(var i=0; i< 10; i++){ %> 
$x = create folder x, parentID 
<%} %>
```

