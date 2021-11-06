
console.log(22222)
function logout(){
    document.cookie = `token=${token}; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
    document.cookie = `username=${currentUserName}; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
    token = null;
    currentUserName = null;
    document.getElementsByClassName("switcher-wrapper").item(0).remove();
    document.getElementsByClassName("wrapper").item(0).innerHTML = '';
    startLoad(null);
}
document.getElementsByClassName("user-name").item(0).innerHTML = currentUserName;