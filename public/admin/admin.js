
$('#sqlInputBtn').click(function(){
	var send = $('#sqlInput').val();
	sampleRequest(send);
	//generateTable(data);
});
function sampleRequest(send){
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
function generateError(msg){
	$( "#errorMsg" ).load( "../support/error.html", function(){
		var element = 'Your Query: "<i>' + msg + '</i>" didnt work';
		$('#' + this.id + '> div').append(element);
		$('.message .close').on('click', function() {
    		$(this).closest('.message').transition('fade');
 		});
	});
}