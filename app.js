//node app.js --infile=test3.bex

var fs        = require('fs')
  , path      = require('path')
  , XmlStream = require('xml-stream')
  , moment	  = require("moment")
  , argv 	  = require('optimist').argv;

// Create a file stream and pass it to XmlStream
var stream = fs.createReadStream(path.join(__dirname, argv.infile));
var xml = new XmlStream(stream);

var endDate, startDate, type, prevEndDate, name, comment = "";
var dateCollection = new Array();


xml.on('endElement: key', function(key) {
	if(key.$text == "endDateTime") {
		type = "end";
	}
	if(key.$text == "startDateTime") {
		type = "start";
	}	
	if(key.$text == "name") {
		type = "name";
	}		
	if(key.$text == "comment") {
		type = "comment";
	}	
});
xml.on('endElement: string', function(key) {
	if(type=="name" && typeof name == 'undefined')
		{name = key.$text;
			console.log(name);
		}
	if(type=="comment")
		comment = key.$text;
});


xml.on('endElement: date', function(date) {
	if(type=="end") {
		//console.log("ends: " + date.$text);
		
		prevEndDate = endDate;
		endDate = moment(date.$text);
		type="";
	}
	if(type=="start" && typeof endDate !='undefined' ) {
		//console.log("starts: " + date.$text);

		startDate = moment(date.$text);
		type="";
		
		if(typeof endDate !='undefined') {
			var addseconds = parseFloat(endDate.diff(startDate, 'seconds', false));
			if (typeof comment == undefined) comment = "";
			dateCollection.push({'start': endDate.format("D-M-YYYY"), 'seconds' : addseconds, 'comment' :comment });
			comment = "";
		}
		
			
	}

});
xml.on('end', function(data) {

var output = processTotals(dateCollection);
fs.writeFile(name+".csv",output, 
	function(err) {
	    if(err) {
	        console.log(err);
	    } else {
	        console.log("The file was saved!");
	    }
	}); 
});

function processTotals(dateCollectionIn) {
	var prevDate = "";
	var newDateArr = {};
	var output = "";
	output = "Date;Hours;Comments\n";
	for (date in dateCollectionIn) {
		var curDate = dateCollectionIn[date];
		var comment = curDate.comment;
		
		
		if(newDateArr[curDate.start] != undefined) {
			if(comment!="") {
				if(newDateArr[curDate.start].comment != "") comment = newDateArr[curDate.start].comment + ', ' + comment;	
			} else {
				comment = newDateArr[curDate.start].comment;
			}
			
			newDateArr[curDate.start] = { 'seconds': (newDateArr[curDate.start].seconds + curDate.seconds), 'comment' : comment};
			
		}
		else {
			newDateArr[curDate.start] = {'seconds': curDate.seconds, 'comment': comment};
		}
		
	}

	var total = 0;
	for (date in newDateArr) {
		var curDate = newDateArr[date].seconds;
		var number = Math.round(curDate/60/60*100)/100; 

		number = (Math.round(number * 4) / 4).toFixed(2);

		if(number>0)
			output += date + ";" + (number+"").replace(".",",") + ";" + newDateArr[date].comment  + "\n";
		total += parseFloat(number);
	}
	output += ("Total;"+total).replace(".",",");
	return output;
}

