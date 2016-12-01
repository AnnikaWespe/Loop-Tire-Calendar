var statusColorMap = {
	rot: "red",
	gelb: "yellow",
	gruen: "green",
	blau: "blue",
	lila: "pink"
}

var availableTires;
var year0;
var year1;
var year2;
var year3;

var numberOfRowsList;

$(document).ready(function() {
	var date = new Date();
	year1 = date.getFullYear();
	year0 = year1 - 1;
	year2 = year1 + 1;
	year3 = year1 + 2;
	$(".lastYear").text(year0);
	$(".lastYear").closest("table").addClass("year" + year0);
	$(".thisYear").text(year1);
	$(".thisYear").closest("table").addClass("year" + year1);
	$(".nextYear").text(year2);
	$(".nextYear").closest("table").addClass("year" + year2);
	$(".yearAfterNext").text(year3);
	$(".yearAfterNext").closest("table").addClass("year" + year3);
	getAvailableTires();
});

var getAvailableTires = function() {
	availableTires = ["1;#Reifen 1", "2;#Reifen 2", "3;#Reifen 3", "4;#Reifen 4", "5;#Reifen 5"];
	getTablesReady();
	setTableData();
}

var getTablesReady = function() {
	var kalenderWochen = "<tr class = 'week'><th> </th>";
	var numberOfDiffTires = availableTires.length;

	for (var i = 0; i < 52; i++) {
		kalenderWochen += "<th>" + (i + 1) + "</th>";
	};
	kalenderWochen += "</th>";
	$(".table-year").append(kalenderWochen);

	for (var i = 0; i < numberOfDiffTires; i++) {
		var tableCells = "<tr class = 'tableCells row" + i + "' style='font-size: 50%'><td>" + availableTires[i] + "</td>";
		for (var j = 0; j < 52; j++) {
			tableCells += "<td class = 'row" + i + "column" + j + "'></td>";
		};
		tableCells += "</th>";
		$(".table-year").append(tableCells);
	};
}


var setTableData = function() {
	$SP().list("Loop-Timing").info(function(fields) {
		var nameDisplaynameMap = {};
		var displaynameNameMap = {};
		//creating maps so we can get SP name of column from displayed name and vice versa
		for (var i = 0; i < fields.length; i++) {
			var key = fields[i]["Name"];
			var value = fields[i]["DisplayName"];
			nameDisplaynameMap[key] = value;
			displaynameNameMap[value] = key;
			console.log(value + " " + key);
		};
		$SP().list("Loop-Timing").get(function(data) {
			numberOfRowsList = data.length;
			for (var i = 0; i < numberOfRowsList; i++) {
				var currentStartKW = new Number(data[i].getAttribute("gkqu")) - 1;
				var currentEndKW = new Number(data[i].getAttribute("vc3x"));
				var currentEndYear = new Number(data[i].getAttribute("ubmk"));
				var currentStartYear = new Number(data[i].getAttribute("gj8q"));
				var currentTitle = data[i].getAttribute("Title");
				var currentStatus = data[i].getAttribute("Statusfarbe");
				var currentTire = data[i].getAttribute("Reifentyp");
				var currentTooltipText = data[i].getAttribute("hdhj");
				var currentRow = availableTires.indexOf(currentTire);
				var yearMin = new Number(year0);
				var yearMax = new Number(year3);
				console.log(yearMin + " " + yearMax);
				if (currentStartYear < yearMin && currentEndYear == year0) {
					markBeginningOfYear(year0, currentEndKW, currentStatus, i, currentRow, currentTooltipText, currentTitle);
				} else if (currentEndYear > yearMax && currentStartYear == year3) {
					markEndOfYear(year3, currentStartKW, currentStatus, i, currentRow, currentTooltipText, currentTitle);
				} else if (yearMin <= currentStartYear && currentEndYear <= yearMax) {
					if (currentStartYear < currentEndYear) {
						markEndOfYear(currentStartYear, currentStartKW, currentStatus, i, currentRow, currentTooltipText, currentTitle);
						markBeginningOfYear(currentEndYear, currentEndKW, currentStatus, i, currentRow, currentTooltipText, currentTitle);
					} else {
						markInYear(currentStartYear, currentStartKW, currentEndKW, currentStatus, i, currentRow, currentTooltipText, currentTitle);
					}
				};
			};
			setTooltips();
		});
	})
}

var markBeginningOfYear = function(year, KW, status, index, row, comment, title) {
	$eventsection = $(".year" + year).find(".row" + row + "column0");
	$eventsection.attr('colspan', KW);
	$eventsection.addClass("index" + index);
	$eventsection.css("background-color", statusColorMap[status]);
	$eventsection.data("tooltip", comment);
	$eventsection.text(title);
	for (var i = 1; i < KW; i++) {
		$(".year" + year).find(".row" + row + "column" + i).hide();
	}
}

var markEndOfYear = function(year, KW, status, index, row, comment, title) {
	var calendarWeek = KW - 1;
	var remainingWeeks = 53 - KW;
	$eventsection = $(".year" + year).find(".row" + row + "column" + calendarWeek);
	$eventsection.attr('colspan', remainingWeeks);
	$eventsection.addClass("index" + index);
	$eventsection.css("background-color", statusColorMap[status]);
	$eventsection.data("tooltip", comment);
	$eventsection.text(title);
	for (var i = KW; i < 53; i++) {
		$(".year" + year).find(".row" + row + "column" + i).hide();
	}
}
var markInYear = function(year, start, end, status, index, row, comment, title) {
	// for (var j = start; j < end; j++) {
	// 	$currentTableCell = $(".year" + year).find("[id='row0column" + j + "']");
	// 	$currentTableCell.data("index", index);
	// 	$currentTableCell.addClass("highlightedCalendarWeek");
	// 	$currentTableCell.css("background-color", statusColorMap[status]);
	// };
}

var setTooltips = function() {
	var $highlightedCalendarWeeks = $(".highlightedCalendarWeek");
	$highlightedCalendarWeeks.each(function(index, value) {
		var $this = $(this);
		var currentIndex = $this.data("index");
		alert(currentIndex);
		// $this.mouseover(function(index) {
		// 	$SP().list(currentListName).get(function(data) {
		// 		var arrayOfHiddenColumns = [columnGeaendertAm, columnGeaendertVon, columnErfasstAm, columnErstelltVon, columnCopyHistory];
		// 		var arrayOfColumnsWithAestheticProblems = [columnGeaendertVon, columnErstelltVon, columnErfasstAm, columnGeaendertAm];
		// 		var numberOfHiddenColumns = arrayOfHiddenColumns.length;
		// 		var infoText = "";
		// 		for (var i = 0; i < numberOfHiddenColumns; i++) {
		// 			var currentColumnName = arrayOfHiddenColumns[i];
		// 			var currentColumnNumber = nameColumnNumberMap[currentColumnName];
		// 			var currentColumnDisplayName = nameDisplaynameMap[currentColumnName];
		// 			var currentEntry = data[currentIndex].getAttribute(currentColumnName);
		// 			if (currentEntry == null) {
		// 				currentEntry = " ";
		// 			};
		// 			if (arrayOfColumnsWithAestheticProblems.indexOf(currentColumnName) !== -1) {
		// 				var helperArray = currentEntry.split("#");
		// 				currentEntry = helperArray[1];
		// 			}
		// 			infoText += currentColumnDisplayName + ": " + currentEntry + "&lt;br /&gt;";
		// 		};
		// 		$this.wrap(bootstrapTooltip + infoText + '"></a>');
		// 		$this.closest("a").tooltip();
		// 	})
		// })
	});
}