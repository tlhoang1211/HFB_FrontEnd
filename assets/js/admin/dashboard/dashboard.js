
"use strict";
var toDate = null, fromDate = null;
var date = new Date(), y = date.getFullYear(), m = date.getMonth();
var firstDay = new Date(y, m, 1).toLocaleDateString("vi-VN");
var lastDay = new Date(y, m + 1, 0).toLocaleDateString("vi-VN");
var configchart = {
	series: [{
		name: "Charity Money",
		data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
	}, {
		name: "Food",
		data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
	}, {
		name: "Request",
		data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
	}],
	chart: {
		foreColor: "#9ba7b2",
		type: "bar",
		height: 300,
		toolbar: {
			show: !1
		}
	},
	plotOptions: {
		bar: {
			horizontal: !1,
			columnWidth: "55%",
			endingShape: "rounded"
		}
	},
	grid: {
		borderColor: 'rgba(255, 255, 255, 0.12)',
		show: true,
	},
	dataLabels: {
		enabled: !1
	},
	stroke: {
		show: !0,
		width: 2,
		colors: ["transparent"]
	},
	colors: ["rgba(255, 255, 255, 0.60)", "#fff", "rgba(255, 255, 255, 0.25)"],
	xaxis: {
		categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"]
	},
	fill: {
		opacity: 1
	},
	tooltip: {
		theme: "dark",
		y: {
			formatter: function(e) {
				return "$ " + e + " thousands"
			}
		}
	}
};
// chart.updateSeries([{
// 	name: 'a',
// 	data: a_data
//   }, {
// 	name: 'b',
// 	data: b_data
//   }])
function convertDate(d) {
	var str = new Date(d).toLocaleDateString("vi-VN");
	return str;
}
function drawChart() {
	var dataPost = {
		"startDate": "2021-11-02",
    	"endDate":"2021-11-03"
	}
	// donate
	getConnectAPI('POST', 'https://hfb-t1098e.herokuapp.com/api/v1/hfb/statistics/donation', JSON.stringify(dataPost), function (result) {
        if (result && result.status == 200) {
            if (result.data) {
                console.log(result)
            }
        }
    },
        function (errorThrown) { }
    );
	// food
	getConnectAPI('POST', 'https://hfb-t1098e.herokuapp.com/api/v1/hfb/statistics/food', JSON.stringify(dataPost), function (result) {
        if (result && result.status == 200) {
			// request
			getConnectAPI('POST', 'https://hfb-t1098e.herokuapp.com/api/v1/hfb/statistics/request', JSON.stringify(dataPost), function (result) {
				if (result && result.status == 200) {
					if (result.data) {
						console.log(result)
					}

				}
			},
				function (errorThrown) { }
			);
        }
    },
        function (errorThrown) { }
    );
	
}

new ApexCharts(document.querySelector("#chart_donate"), configchart).render();
new ApexCharts(document.querySelector("#chart_food"), configchart).render();
function initDaterangepicker(alwaysShowCalendars) {
	$('#rs-date').daterangepicker({
		parentEl: ".divDateRangePicker",
		format: 'DD/MM/YYYY',
		opens: "right",
		drops: 'down',
		startDate: fromDate ? moment(fromDate) : moment().startOf('month'),
		endDate: toDate ? moment(toDate) : moment().endOf('month'),
		alwaysShowCalendars: true,
		ranges: {
			'Today': [moment(), moment()],
			'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
			'Last 7 Days': [moment().subtract(6, 'days'), moment()],
			'Last 30 Days': [moment().subtract(29, 'days'), moment()],
			'This Month': [moment().startOf('month'), moment().endOf('month')],
			'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
		}
	}).on('hide.daterangepicker', function (ev, picker) {
		var fromDate_temp = new Date(picker.startDate.format('YYYY-MM-DD HH:mm')).setHours(0, 0, 0, 0);
		var toDate_temp = new Date(picker.endDate.format('YYYY-MM-DD HH:mm')).setHours(0, 0, 0, 0) + 86400000 - 1;
		if (toDate_temp != toDate || fromDate_temp != fromDate) {
			toDate = toDate_temp;
			fromDate = fromDate_temp;
		}
		if (!fromDate && !toDate) {
			initDaterangepicker(false);
			$('#rs-date').val(firstDay + " - " + lastDay);
		} else {
			console.log(fromDate)
			console.log(toDate)
			initDaterangepicker(true);
			$('#rs-date').val(convertDate(fromDate) + ' - ' + convertDate(toDate));
		}
		drawChart();
	}).on('show.daterangepicker', function (ev, picker) {
	});
}
function initPageDashboard() {
	initDaterangepicker(false);
	if (fromDate && toDate) {
		$('#rs-date').val(new Date(fromDate).toLocaleDateString("vi-VN") + ' - ' + new Date(toDate).toLocaleDateString("vi-VN"));
	} else {
		$('#rs-date').val(firstDay + " - " + lastDay);
	}
	drawChart();
}
initPageDashboard();