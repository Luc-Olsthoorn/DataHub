//Lets require/import the HTTP module
var http = require('http');
var fs = require('fs');
var express = require('express');
var app = express();
var path = require('path');
//Lets define a port we want to listen to
const PORT=8080; 

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  		res.sendFile(path.join(__dirname, 'public/admin/admin.html'));
	});
app.post('/upload', function(req, res){
	
}

var server = app.listen(PORT, function(){
  console.log('Server listening on port');
});
