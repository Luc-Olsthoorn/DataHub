"use strict";
//Lets require/import the HTTP module
var http = require('http');
var fs = require('fs');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var formidable = require('formidable');

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
app.get('/sell', function(req, res){
  		res.sendFile(path.join(__dirname, 'public/sell/sell.html'));
	});
app.get('/buy', function(req, res){
  		res.sendFile(path.join(__dirname, 'public/buy/buy.html'));
	});
app.post('/getListings', function(req, res){
	var insertQuery = "SELECT * FROM Data;";
	connection.query(insertQuery, function (error, results, fields) {
		  if (error) throw error;
		  res.send(JSON.stringify(results));
		});
});
app.post('/getPrices', function(req, res){
	var obj = {};
	//console.log(req);
	obj = req.body;
	console.log(obj);
	var insertQuery = "SELECT * FROM " + obj[0] + ";";
	console.log(insertQuery);
	connection.query(insertQuery, function (error, results, fields) {
		  if (error) throw error;
		  res.send(results);
		});
});
app.post('/query', function(req, res){

	connection.query(req.body, function (error, results, fields) {
		  if (error) throw error;
		  console.log('The solution is: ', results);
		  res.send(JSON.stringify(results));
		});

});
app.post('/uploadSell', function(req, res){
	console.log("uploading...");
	var form = new formidable.IncomingForm();
	var tableCreated = false;
	form.multiples = true;

	form.on('file', function(field, file) {
		var queries = [];
		var i = 0;
		var tableName="temp";
		var rowKeys = [];
		CSVToJSON(file.path, function(data){
			if(!tableCreated)
				{

					tableCreated = true;
					queries[0] = JSONToSQLTable(data, tableName);
					i++;
				}
				
			JSONToSQL(data, tableName ,function(insertQuery, inRowKeys){
				rowKeys = inRowKeys;
				queries[i] = insertQuery;
				i++;
			});
		});
		setTimeout(function(){
			console.log(queries);
			var returned = false;
			for(var j=0; j < queries.length; j++)
			{
				connection.query(queries[j], function (error, results, fields) {
				console.log("running SQL");
				
				  if (error) throw error;
				  console.log("done");
				  if(!returned)
				  {
				  	console.log("sending");
				  	 res.send(rowKeys);
				  	 returned =true;
				  }
				 
				});
			}
			
		},2000);
	});
	form.parse(req);
});

function CSVToJSON(csvFilePath, callback){

	const csv=require('csvtojson');
	csv()
	.fromFile(csvFilePath)
	.on('json',(jsonObj)=>{
		callback(jsonObj);
	})
	.on('done',(error)=>{
	    console.log('end')
	})
}
function JSONToSQLTable(inputJSON, tableName){
	console.log(inputJSON); //TODO find something for improper attribute names 
	//var output = 'Drop TABLE ' + tableName + ";"; //TODO IMPLEMENT A NON JANK WAY OF OVERWRITNG TABLES
	var output = 'CREATE TABLE ' + tableName + "(";
	var rowKeys = Object.keys(inputJSON);//gets an array of the keys
	//adding headers
	for(var i=0; i < rowKeys.length; i++)
	{
		output += rowKeys[i] + " " + "VARCHAR(255)";
		if(i<rowKeys.length-1)
		{
			output += ",";
		}
	}
	output+= ");";
	return output;
}
function JSONToSQL(inputJSON, tableName, callback){
	var rowKeys = Object.keys(inputJSON);
	var output = 'INSERT INTO ';
	output += tableName;
	output += '(';
	for(var i=0; i < rowKeys.length; i++)
	{
		output += rowKeys[i];
		if(i<rowKeys.length-1)
		{
			output += ",";
		}
	}
	//for loop for the column names
	output += ') VALUES (';
	for(var i=0; i < rowKeys.length; i++)
	{
		output += "'" +inputJSON[rowKeys[i]] + "'";
		if(i<rowKeys.length-1)
		{
			output += ",";
		}
	}
	output += ');';
	callback(output, rowKeys);
	//
}
app.post('/uploadPrice', function(req, res){
	var obj = {};
	obj = req.body;
	
	var insertQuery = "RENAME TABLE temp TO " + obj[0][0] + ";";
	console.log(insertQuery);
	connection.query(insertQuery, function (error, results, fields) {
			if (error) throw error;
			console.log("renamed!");
		});
	insertQuery ="INSERT INTO Data (name,description) VALUES('"+obj[0][0]+"','"+obj[0][1]+"')";
	connection.query(insertQuery, function (error, results, fields) {
			if (error) throw error;
			console.log("INSERTED INTO DATA");
		});
	insertQuery = 'CREATE TABLE ' + obj[0][0]+"Price" + "("; 
	for(var i=0; i < obj.length; i++){
		insertQuery += obj[i][0] + " " + "VARCHAR(255)";
		if(i<obj.length-1)
		{
			insertQuery += ",";
		}
	}
	insertQuery+= ");";
	console.log(insertQuery);
	connection.query(insertQuery, function (error, results, fields) {
		if (error) throw error;
		console.log("created Price test");
		
		insertQuery = 'INSERT INTO ' + obj[0][0]+"Price" + "(";
		for(var i=0; i < obj.length; i++){
			insertQuery += obj[i][0] + " ";
			if(i<obj.length-1)
			{
				insertQuery += ",";
			}
		}
		insertQuery += ') VALUES (';
		for(var i=0; i < obj.length; i++){
			insertQuery += "'" + obj[i][1] + "'";
			if(i<obj.length-1)
			{
				insertQuery += ",";
			}
		}
		insertQuery += ");";
		console.log(insertQuery);
		connection.query(insertQuery, function (error, results, fields) {
				if (error) throw error;
				console.log("created Price test");
			});
	});
});
//start this bitch up
var server = app.listen(PORT, function(){
  console.log('Server listening on port');
});
