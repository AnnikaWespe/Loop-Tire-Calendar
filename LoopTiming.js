$(document).ready(function() {
	var date = new Date();
	var thisYear = date.getFullYear();
	var lastYear = thisYear - 1;
	var nextYear = thisYear + 1;
	var yearAfterNext = thisYear + 2;
	getTablesReady();
	$(".lastYear").text(lastYear);
	$(".lastYear").closest("table").addClass("year" + lastYear);
	$(".thisYear").text(thisYear);
	$(".thisYear").closest("table").addClass("year" + thisYear);
	$(".nextYear").text(nextYear);
	$(".nextYear").closest("table").addClass("year" + nextYear);
	$(".yearAfterNext").text(yearAfterNext);
	$(".yearAfterNext").closest("table").addClass("year" + yearAfterNext);
	setTableData(lastYear, thisYear, nextYear, yearAfterNext);
});

var getTablesReady = function() {
	var kalenderWochen = "<tr class = 'week'>";
	var tableCells = "<tr class = 'tableCells'>";

	for (var i = 0; i < 52; i++) {
		kalenderWochen += "<th>" + i + "</td>";
		tableCells += "<td id = 'row0column" + i + "'></td>";
	};
	kalenderWochen += "</th>";
	tableCells += "</th>";
	$(".table-year").append(kalenderWochen);
	$(".table-year").append(tableCells);
}

var setTableData = function(year0, year1, year2, year3) {
	$SP().list("Dummy Liste Dev Loop").info(function(fields) {
		var nameDisplaynameMap = {};
		var displaynameNameMap = {};
		var numberOfRows;
		//creating maps so we can get SP name of column from displayed name and vice versa
		for (var i = 0; i < fields.length; i++) {
			var key = fields[i]["Name"];
			var value = fields[i]["DisplayName"];
			nameDisplaynameMap[key] = value;
			displaynameNameMap[value] = key;
			console.log(value + " " + key);
		};
		$SP().list("Dummy Liste Dev Loop").get(function(data) {
			numberOfRows = data.length;
			for (var i = 0; i < numberOfRows; i++) {
				var currentStartKW = new Number(data[i].getAttribute("gkqu"));
				var currentEndKW = new Number(data[i].getAttribute("vc3x"));
				var currentEndYear = new Number(data[i].getAttribute("ubmk"));
				var currentStartYear = new Number(data[i].getAttribute("gj8q"));
				var currentTitle = data[i].getAttribute("Title");
				var currentStatus = data[i].getAttribute("Statusfarbe");
				var yearMin = new Number(year0);
				var yearMax = new Number(year3);
				console.log(" " + currentEndKW + " " + currentStartYear + " " + currentStatus + " " + currentTitle + " " + currentStartKW + " " + currentEndYear);
				if (currentStartYear < yearMin) {
					if (currentEndYear == year0) {
						for (var j = 0; j < currentEndKW; j++) {
							$(".year" + year0).find("[id='row0column" + j + "']").css("background-color", "green");
						}
						alert(currentStatus);
					}

				}
			};
		});
	})
}