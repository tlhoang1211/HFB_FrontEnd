"use strict";
$(function () {
	$("#header").load("./inc/header.html");
	$("#footer").load("./inc/footer.html");
});
function getCookie (key){
	if (document.cookie) {
		var value;
		var split = document.cookie.split(';');
		if (split && split.length > 0) {
			for (let index = 0, len = split.length; index < len; index++) {
				var element = split[index].trim();
				if (element.indexOf(key) != -1) {
					console.log(123123)
					value = element.split('=')[1];
				}
			}
		}
		return value;
	} else {
		return '';
	}
}
var currentName = getCookie('username');
var isToken = getCookie('token');
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
	document.getElementById ("logout").addEventListener("click", logoutAccount);
    var loginregister = document.querySelector('#login-register');
    var useraccount = document.querySelector('#user-account')


    var token = null;
    var usernameAccount = null;
    
    function logoutAccount(){
      document.cookie = `token=${token}; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
      document.cookie = `username=${usernameAccount}; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
      token = null;
      usernameAccount = null;
      start();
      if(location.href == 'http://127.0.0.1:5500/tabs_and_accordions.html'){
        location.replace('../index_shop.html');
      }else{
        location.reload();
      }
    }
    useraccount.style.display = 'none';
    
    start();
    function start(){
      if(document.cookie != null && document.cookie != ''){
        var pairs = document.cookie.split(";");
        var cookies = {};
        for (var i=0; i<pairs.length; i++){
          var pair = pairs[i].split("=");
          cookies[(pair[0]+'').trim()] = unescape(pair.slice(1).join('='));
        }
        token = cookies.token;
        usernameAccount = cookies.username;
      }
      if(token ===null || token === undefined || token === NaN || token === ''){
        
        loginregister.style.display = 'block';
        useraccount.style.display = 'none';
      }else {
        loginregister.style.display = 'none';
        useraccount.style.display = 'block';

        var getUser = `https://hfb-t1098e.herokuapp.com/api/v1/hfb/users/${usernameAccount}`;
        var viewAccount = document.querySelector('.navbar__user');
        fetch(getUser,{
          method: 'GET',
          headers: {
            "Authorization":`Bearer ${token}`
          }
        })
        .then(response => response.json())
        .then(account => {
          	var htmlsItem = `
                <img style="width: 22px; height: 22px; border-radius: 50%; border: 1px solid rgba(0, 0, 0, 0.1);"
                    src="https://thumbs.dreamstime.com/b/user-icon-trendy-flat-style-isolated-grey-background-user-symbol-user-icon-trendy-flat-style-isolated-grey-background-123663211.jpg" alt="" class="navbar__user-img">
                <span>${account.data.name}</span>
                `;
			if(account && account.data && account.data.name) {
				currentName = account.data.name;
			}
          	viewAccount.innerHTML = htmlsItem;
        })
        .catch(error => console.log(error));
      }
    }

