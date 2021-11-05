// get data Account
function getDetailAccount() {
    getConnectAPI('GET', 'https://hfb-t1098e.herokuapp.com/api/v1/hfb/users/' + usernameDetail, null, function (result) {
        if (result && result.status == 200) {
            if (result.data) {
                console.log(result)
                $('#name_account, .name_account').val(result.data.name);
                $('#username_account, .username_account').val(result.data.username);
                $('#phone_account').val(result.data.phone);
                $('#address_account, .address_account').val(result.data.address);
                $('#avatar_account').attr('src', result.data.avatar);
            }
        }
    },
        function (errorThrown) { }
    );
}
getListAccount();
// save Account
function saveChangeAccount() {
    var name = $('#name_account').val();
    var username = $('#username_account').val();
    var phone = $('#phone_account').val();
    var address = $('#address_account').val();
    var password = $('#address_account').val();
    if (!name) {
        notification('warning', "Name is required!");
        return false;
    }
    if (!username) {
        notification('warning', "Username is required!");
        return false;
    }
    if (!username) {
        notification('warning', "Username is required!");
        return false;
    }
    if (listImageAccount.length == 0) {
        notification('warning', "Avatar is required!");
        return false;
    }

    var dataPost = {
        name: name,
        username: username,
        password: password,
        phone: phone,
        address: address,
        avatar: listImageAccount[0]
    }
    getConnectAPI('POST', 'https://hfb-t1098e.herokuapp.com/api/v1/hfb/users', JSON.stringify(dataPost), function (result) {
        if (result && result.status == 200) {
            notification('success', "Successfully added new");
            goBack('account', 'account');
        }
    },
        function (errorThrown) { }
    );
}