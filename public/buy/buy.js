
function generateList(data){
	var output = '<div class="ui styled accordion">';
	for(var i=0; i<data.length; i++)
	{
		
		output += '<div class="title ">';
	    output += '<span><h2>';
	    output += data[i].name;
	  	output += '</h2></span><span><p>';
	  	output += data[i].description;
	  	output += '</p></span><span><i class="dropdown icon"></i></span></div>';
	  	output += '<div class="content "><div class="ui grid ">';
	    output += '<p class="transition visible" style="display: block !important;">';
	    output += '<div class="ui input"><input id= "'+data[i].name+'Input" type="text" placeholder="SQL Query"></div></p>';
	  	output += '<button class="ui button blue" id="'+data[i].name+'btn">Calculate</button>';
	  	output += '<button class="ui button green" id="'+data[i].name+'Buy">Buy Now</button>';
	  	output += '<span><div id ="'+data[i].name+'Output"></div></span>';
	  	output += '</div></div>';
	  
	}
  	output += '</div>';
  	$( "#queryTable" ).append(output);
  	for(var i=0; i<data.length; i++)
	{
		$('#'+ data[i].name+'btn').on('click', function(){
	  		var string =  $(this)[0].id.split("btn")[0];
	  		console.log("yeeeet");
	  		console.log(string);
    		calculatePrice(string);
		});
		$('#'+ data[i].name+'Buy').on('click', function(){
	  		var string =  $(this)[0].id.split("Buy")[0];
    		var input = $('#'+ string+'Input').val().toLowerCase();
    		getTable(input);
		});
	}
  	$('.ui.accordion').accordion();
}
function getPrices(send){
	var url = '/getPrices';
	var total = 0;
	var input = $('#'+ send+'Input').val().toLowerCase();
	console.log(input);
	var temp =[];
	temp[0] = send + "Price";

		$.ajax({
			url: '/getPrices',
			type: 'POST',
			data: JSON.stringify(temp),
			processData: false,
			contentType: 'application/json',
			success: function(data){
				console.log(data);
				var rowKeys = Object.keys(data[0]);
			  for(var i =1; i <rowKeys.length; i++){
			  	//total += 100 * input.split("*").length - 1;
			  	console.log(rowKeys[i]);
			  	console.log(data[0][rowKeys[i]]);
			  	total += (input.split(rowKeys[i]).length - 1) * parseInt(data[0][rowKeys[i]]);
			  }
			  console.log(total);
			  total = total/100;
			  $('#'+ send+'Output').empty();
			  $('#'+ send+'Output').append(total + " cents per row");
			}
	  	});

}
function calculatePrice(name){
	var string = $('#'+name + 'Input').val();
	var temp = getPrices(name);
	console.log(temp);
}
function sampleRequest(){
	$( "#queryTable" ).load( "../support/loading.html");
	console.log("sending...");

	var url = '/getListings';
	$.ajax({
		type: "POST",
		contentType: 'text/plain',
		dataType:'json',
		url: url,
		crossDomain : true,
		success: function(data)
		{
			console.log("Recieving data...")
			console.log(data);
			$( "#queryTable" ).empty();
			generateList(data);
		},
		error: function(){
			$( "#queryTable" ).empty();
			
		}
	});

}
function getTable(send){
	$( "#queryTable" ).load( "../support/loading.html");
	console.log("sending...");
	console.log(send);
	var url = '/query';
	$.ajax({
		type: "POST",
		contentType: 'text/plain',
		dataType:'json',
		url: url,
		data: send,
		crossDomain : true,
		success: function(data)
		{
			console.log("Recieving data...")
			console.log(data);
			$( "#queryTable" ).empty();
			generateTable(data);
		},
		error: function(){
			$( "#queryTable" ).empty();
			generateError(send);
		}
	});
}
		
function generateTable(data){
	console.log("Building Table");
	$( "#queryTable" ).load( "../support/table.html", function(){		
		var rowKeys = Object.keys(data);//gets an array of the keys
		var headerArr = Object.keys(data[rowKeys[0]]);
		//adding headers
		for(var i=0; i < headerArr.length; i++)
		{
			var element = $('<th>'+headerArr[i]+'</th>');
			$('#' + this.id + ' table > thead >tr').append(element);
		}
		//adding values in rows
		for(var i=0; i < rowKeys.length; i++ )
		{
			var element = "<tr>";
			for(var j=0; j < headerArr.length; j++)
			{
				element += "<td>" + data[rowKeys[i]][headerArr[j]]; + "</td>";
			}
			element += "</tr>";
			$('#' + this.id + ' table > tbody').append(element);
		}
		$('table').tablesort(); //Makes the table sortable
	});
}
$( document ).ready(function() {
   	sampleRequest();
});