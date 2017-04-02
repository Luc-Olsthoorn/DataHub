$('.upload-btn').on('click', function (){
    $('#upload-input').click();
});
$('#submitTable').on('click' , function(){
	$( "#profit" ).load( "../support/loading.html");
	var files = $('#upload-input').get(0).files;
	if (files.length > 0){

	    var formData = new FormData();
	    
	    for (var i = 0; i < files.length; i++) {
	      var file = files[i];
	      formData.append('uploads[]', file, file.name);

	    }

	    $.ajax({
			url: '/uploadSell',
			type: 'POST',
			data: formData,
			processData: false,
			contentType: false,
			success: function(data){
			  createProfit(data);
			}
	  	});
	}
});
var rowKeys =[];
function createProfit(data){
	rowKeys=data;
	$( "#profit" ).empty();
	$("#upload").empty();
	for(var i =0; i < data.length; i++)
	{
		$( "#profit" ).append(data[i]);
		$( "#profit" ).append('<div class="ui segment"><div class="ui range" id="'+ data[i] + '"></div>');
		$( "#profit" ).append('<div class="ui input"><input type="text" id="'+ data[i]+'val"></div></div>');
	}
	$( "#profit" ).append('<input id="tableName" type="text" placeholder="Table name">');
	$( "#profit" ).append('<button class="ui button"  id ="submitPrice">Finalize</button>');
	$(document).ready(function(){
			for(var i =0; i < data.length;i++)
			{
			$('#'+ data[i]).range({
			    min: 0,
			    max: 10,
			    start: 5,
			    input: '#'+	data[i] + 'val'		  
			});

			}
			});
	console.log(data);
	$('#submitPrice').on('click' , function(){
	var sentItem = [];
	for(var i =0; i < rowKeys.length;i++)
	{
		sentItem[i+1] = [rowKeys[i], $('#' + rowKeys[i]+'val').val()];
	}
	sentItem[0] = $('#tableName').val();
	console.log(sentItem);
	 $.ajax({
			url: '/uploadPrice',
			type: 'POST',
			data: JSON.stringify(sentItem),
			processData: false,
			contentType: 'application/json',
			success: function(data){
			  createProfit(data);
			}
	  	});
});
}


