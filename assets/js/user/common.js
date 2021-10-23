function getTimeFromString(strDate) {
	var arrDateHour = strDate.split(' ');
	var arrDate = arrDateHour[0].split('/');
	var year = parseInt(arrDate[2]);
	var month = parseInt(arrDate[1]) - 1;
	var date = parseInt(arrDate[0]);
	var hours = parseInt(arrDateHour[1].split(':')[0]);
	var minutes = parseInt(arrDateHour[1].split(':')[1]);
	if (isNaN(hours)) {
		hours = 0;
	}
	if (isNaN(minutes)) {
		minutes = 0;
	}
	return new Date(year, month, date, hours, minutes, 0, 0).getTime();
}