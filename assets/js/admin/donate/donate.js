var orderBy = 'asc', statusDonate = null, searchName_Donate, filter_Category;

function onChangeOrderBy(e, type){
    orderBy = type;
    addActive(e);
    getListDonate();
}
function searchNameDonate(ele){
    searchName = $(ele).val();
    getListDonate();
}
// get data Donate
function getListDonate(pageIndex) {
    if (!pageIndex) {
        pageIndex = 0;
    }
    var optionUrl = '';
    if (orderBy) {
        optionUrl += '&order=' + orderBy;
    }
    optionUrl += '&sortBy=id';
    if (searchName_Donate) {
        optionUrl += '&name=' + searchName_Donate;
    }
//     ?name=&phone=&amount=&startCreated=2021-11-01&endCreated=2021-11-04&status=1&page=0&limit=10&sortBy=id&order=desc
    getConnectAPI('GET', 'https://hfb-t1098e.herokuapp.com/api/v1/hfb/donations/search?page=' + pageIndex + '&limit=' + pageSize + optionUrl, null, function(result){
        if (result && result.status == 200) {
            if (result && result.data && result.data.content && result.data.content.length > 0) {
                if (document.querySelectorAll("#table-Donate tbody").lastElementChild) {
                    document.querySelectorAll("#table-Donate tbody").item(0).innerHTML = '';
                }
                document.querySelectorAll("#table-Donate tbody").item(0).innerHTML = renderListDonate(result.data.content);
                var total = 0;
                total = result.data.totalElements;
                var pageNumber = Math.ceil(total / pageSize);
                if (pageNumber == 0){
                    pageNumber = 1;
                }
                var options = {
                    currentPage: pageIndex + 1,
                    totalPages: pageNumber,
                    totalCount: total,
                    size: 'normal',
                    alignment: 'right',
                    onPageClicked: function (e, originalEvent, click, page) {
                        getListDonate(page - 1);
                    }
                }
                $('#nextpage').bootstrapPaginator(options);
            }
            
        }
    },
        function(errorThrown){}
    );
}
getListDonate();
function renderListDonate(data) {
    var count = 0;
    var html = data.map(function (e) {
        count++;
        var htmlS = '';
        htmlS += '<tr>';
        htmlS += '<td>' + count + '</td>';
        htmlS += '<td><img src="https://res.cloudinary.com/vernom/image/upload/' + e.avatar + '" style="width: 30px;height: 30px;"/></td>';
        htmlS += '<td>' + (e.name || "") + '</td>';
        htmlS += '<td>' + convertCategory(e.categoryId) + '</td>';
        htmlS += '<td>' + (e.expirationDate || "") + '</td>';
        htmlS += '<td>';
        htmlS += '<div class="d-flex align-items-center ' + colorStatusDonate(e.status) + '">';
        htmlS += '<i class="bx bx-radio-circle-marked bx-burst bx-rotate-90 align-middle font-18 me-1"></i>';
        htmlS += '<span>' + convertStatusDonate(e.status) +'</span>';
        htmlS += '</div>';
        htmlS += '</td>';
        htmlS += '<td>' + e.createdAt +'</td>';
        htmlS += '<td style="width: 55px;">';
        htmlS += '<div class="d-flex order-actions">';
        htmlS += '<a onclick="formUpdateDonate(this, \'' + e.id + '\')"><i class="bx bx-edit"></i></a>';
        htmlS += '</div>';
        htmlS += '</td></tr>';
        return htmlS;
    });
    return html.join("");
}

var idApproval;
function approvalDonate(e, id, createdBy, avatar){
    idApproval = {
        ele: e.parentElement.parentElement.parentElement,
        id: id,
        createdBy: createdBy,
        avatar: avatar
    }
    $('#approvalDonate').modal('show');
}
function onBrowseDonate(){
    var dataPost = {
        status: 2
    };
    var today = new Date();
    var time = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    getConnectAPI('POST', `https://hfb-t1098e.herokuapp.com/api/v1/hfb/Donates/status/${idApproval.id}`, JSON.stringify(dataPost), function(result){
        if (result && result.status == 200) {
            Notification.send(parseInt(idApproval.createdBy), {
                sender: objAccount.id,
                idNotify: "",
                usernameaccount: "",
                Donateid: parseInt(idApproval.id),
                avatar: idApproval.avatar,
                title: "Admin approved",
                message: "Time request: " + time,
                category: "Donate",
                status: 1,
            });
            $('#approvalDonate').modal('hide');
            getListDonate();
            
        }
    },
        function(errorThrown){}
    );
}
var objDelete;
function deleteDonate(e, id, name, cateID, avatar, images, description, content, expirationDate) {
    objDelete = {
        ele: e.parentElement.parentElement.parentElement,
        id: id,
        name: name,
        cateID: cateID,
        avatar: avatar,
        images: images,
        description: description,
        content: content,
        expirationDate: expirationDate
    }
    $('#deleteDonate').modal('show');
}
function onDeleteDonate(){
    var dataPost = {
        name: objDelete.name,
        updatedBy: objAccount.id,
        categoryId: objDelete.cateID,
        status: 0,
        avatar: objDelete.avatar,
        images: objDelete.images,
        description: objDelete.description,
        content: objDelete.content,
        expirationDate: objDelete.expirationDate
    };
    getConnectAPI('POST', `https://hfb-t1098e.herokuapp.com/api/v1/hfb/Donates/${objDelete.id}`, JSON.stringify(dataPost), function(result){
        if (result && result.status == 200) {
            objDelete.ele.remove();
            $('#deleteDonate').modal('hide');
            getListDonate();
        }
    },
        function(errorThrown){}
    );
}

function convertStatusDonate(status){
    var text = '';
    switch (status) {
        case 0:
            text = 'Deactive';
            break;
        case 1:
            text = 'Pending';
            break;
        case 2:
            text = 'Active';
            break;
        default:
            text = 'Pending';
            break;
    }
    return text;
}

function colorStatusDonate(status){
    var color = '';
    switch (status) {
        case 0:
            color = 'text-danger';
            break;
        case 1:
            color = 'text-warning';
            break;
        case 2:
            color = 'text-success';
            break;
        default:
            color = 'text-warning';
            break;
    }
    return color;
}

function convertCategory(id){
    var text = '';
    if (id && arrCategory) {
        var find = arrCategory.find(function(e){return id == e.id});
        if (find) {
            text = find.name;
        }
    }
    return text;
}

function renderDropdowFilterCategory(){
    var html = '';
    html += '<a class="dropdown-item active" onclick="filterCategory(this)">All</a>';
    for (let index = 0; index < arrCategory.length; index++) {
        var element = arrCategory[index];
        html += '<a class="dropdown-item" onclick="filterCategory(this, \'' + element.id + '\')">'+ element.name +'</a>';
    }
    $('.filter-category .dropdown-menu').append(html);
}
renderDropdowFilterCategory();
var dataFindDonate;
function formUpdateDonate(e, id){
    $('#modalAddDonate').modal('show');
    getConnectAPI('GET', 'http://hfb-t1098e.herokuapp.com/api/v1/hfb/Donates/' + id, null, function(result){
        if (result && result.status == 200) {
            console.log(result)
            dataFindDonate = result;
        }
    },
        function(errorThrown){}
    );
}
function saveUpdateDonate(){
    // var name = document.getElementById("nameDonate").value;
    // var categoryId = document.getElementById("category").value;
    // var expirationDate = document.getElementById("expirationDate").value;
    // var description = document.getElementById("description").value;
    // if (!expirationDate) {
    //     $(".alert-danger").alert();
    //     return false;
    //   }
    //   if (listImageDonate.length == 0) {
    //     $(".alert-danger").alert();
    //     return false;
    //   }
    var expirationDate = $('#expirationDate').val();
    var dataPost = {
        name: name,
        avatar: dataFindDonate.avatar,
        images: dataFindDonate.images,
        expirationDate: expirationDate,
        updatedBy: objAccount.id,
        categoryId: dataFindDonate.categoryId,
        description: dataFindDonate.bootstrapPaginatordescription,
        manufactureDate: '',
        status: 1,
    }
    getConnectAPI('POST', 'http://localhost:8080/api/v1/hfb/Donates/' + id, JSON.stringify(dataPost), function(result){
        if (result && result.status == 200) {
            $('#modalAddDonate').modal('hide');
            console.log(result)
        }
    },
        function(errorThrown){}
    );
}