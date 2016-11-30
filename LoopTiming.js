var statusColorMap = {
	rot: "red",
	gelb: "yellow",
	gruen: "green",
	blau: "blue",
	lila: "pink"
}
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
		kalenderWochen += "<th>" + (i + 1) + "</th>";
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
				var currentStartKW = new Number(data[i].getAttribute("gkqu")) - 1;
				var currentEndKW = new Number(data[i].getAttribute("vc3x"));
				var currentEndYear = new Number(data[i].getAttribute("ubmk"));
				var currentStartYear = new Number(data[i].getAttribute("gj8q"));
				var currentTitle = data[i].getAttribute("Title");
				var currentStatus = data[i].getAttribute("Statusfarbe");
				var yearMin = new Number(year0);
				var yearMax = new Number(year3);
				if (currentStartYear < yearMin && currentEndYear == year0) {
					markBeginningOfYear(year0, currentEndKW, currentStatus, i);
				} else if (currentEndYear > yearMax && currentStartYear == year3) {
					markEndOfYear(year3, currentStartKW, currentStatus, i);
				} else if (yearMin <= currentStartYear && currentEndYear <= yearMax) {
					if (currentStartYear < currentEndYear) {
						markEndOfYear(currentStartYear, currentStartKW, currentStatus, i);
						markBeginningOfYear(currentEndYear, currentEndKW, currentStatus, i);
					} else {
						markInYear(currentStartYear, currentStartKW, currentEndKW, currentStatus, i);
					}
				};
			};
			setTooltips();
		});
	})
}

var markBeginningOfYear = function(year, KW, status, index) {
	for (var j = 0; j < KW; j++) {
		$currentTableCell = $(".year" + year).find("[id='row0column" + j + "']");
		$currentTableCell.addClass("index" + index);
		$currentTableCell.css("background-color", statusColorMap[status]);
	};
}

var markEndOfYear = function(year, KW, status, index) {
	for (var j = KW; j < 52; j++) {
		$currentTableCell = $(".year" + year).find("[id='row0column" + j + "']");
		$currentTableCell.addClass("index" + index);
		$currentTableCell.css("background-color", statusColorMap[status]);
	}
}
var markInYear = function(year, start, end, status, index) {
	for (var j = start; j < end; j++) {
		$currentTableCell = $(".year" + year).find("[id='row0column" + j + "']");
		$currentTableCell.data("index", index);
		$currentTableCell.addClass("highlightedCalendarWeek");
		$currentTableCell.css("background-color", statusColorMap[status]);
	};
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