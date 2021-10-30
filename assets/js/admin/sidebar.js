"use strict"

function changePage(e, page){
    var classLi = document.getElementsByClassName("mm-sidebar");
    if (classLi && classLi.length > 0) {
		for (let index = 0, len = classLi.length; index < len; index++) {
			var element = classLi[index];
			element.classList.remove('active');
		}
	}
	e.parentElement.classList.add("active");
}