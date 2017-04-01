//Lets require/import the HTTP module
var http = require('http');
var fs = require('fs');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

const PORT=8080; 
//SQL CONNECTION 
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'dataHubPass',
  database : 'DataHub'
});
//For handling post and get requests
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.text() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//endPoints
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  		res.sendFile(path.join(__dirname, 'public/admin/admin.html'));
	});
app.post('/query', function(req, res){
	var test = req.body;
	connection.connect();
	console.log(test);
	connection.query(test, function (error, results, fields) {
		  if (error) throw error;
		  console.log('The solution is: ', results);
		  res.send(JSON.stringify(results));
		});
	connection.end();

});
//start this bitch up
var server = app.listen(PORT, function(){
  console.log('Server listening on port');
});
