// save Account
function saveAccount() {
    var name = document.getElementById("nameAccount").value;
    var categoryId = document.getElementById("category").value;
    var expirationDate = document.getElementById("expirationDate").value;
    var description = document.getElementById("description").value;
    if (!expirationDate) {
        $(".alert-danger").alert();
        return false;
    }
    if (listImageAccount.length == 0) {
        $(".alert-danger").alert();
        return false;
    }

    var dataPost = {
        name: name,
        avatar: listImageAccount[0],
        images: listImageAccount.join(","),
        expirationDate: expirationDate,
        createdBy: objAccount.id,
        categoryId: categoryId,
        description: description
    }
    getConnectAPI('POST', 'https://hfb-t1098e.herokuapp.com/api/v1/hfb/users', JSON.stringify(dataPost), function (result) {
        if (result && result.status == 200) {
            getListAccount();
            $('#modalAddAccount').modal('hide');
        }
    },
        function (errorThrown) { }
    );
}