
var orderBy = 'desc', statusFood = null, searchName, filter_Category;
function formAddFood() {
    var pageContent = document.getElementsByClassName('page-content');
    if (pageContent.item(0)) {
		pageContent.item(0).remove();
	}
	localStorage.setItem('page', 'newFood');
	loadHtml( '../../../inc/layout/admin/content/food/newFood.html', '.page-wrapper', 'div', 'page-content', '', 'afterbegin', '../../../assets/js/admin/food/newFood.js');
}
function onChangeOrderBy(e, type){
    orderBy = type;
    addActive(e);
    getListFood();
}
function filterStatus(e, type){
    if (type) {
        statusFood = type;
    } else {
        statusFood = null;
    }
    addActive(e);
    getListFood();
}
function filterCategory(e, id){
    if (id) {
        filter_Category = parseInt(id);
    } else {
        filter_Category = null;
    }
    addActive(e);
    getListFood();
}
function searchNameFood(ele){
    searchName = $(ele).val();
    getListFood();
}
// get data food
function getListFood(pageIndex) {
    if (!pageIndex) {
        pageIndex = 0;
    }
    var optionUrl = '';
    if (statusFood) {
        optionUrl += '&status=' + parseInt(statusFood);
    }
    if (orderBy) {
        optionUrl += '&order=' + orderBy;
    }
    optionUrl += '&sortBy=createdAt';
    if (searchName) {
        optionUrl += '&name=' + searchName;
    }
    if (filter_Category) {
        optionUrl += '&categoryId=' + filter_Category;
    }
    getConnectAPI('GET', 'https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods/search?page=' + pageIndex + '&limit=' + pageSize + optionUrl, null, function(result){
        if (result && result.status == 200) {
            if (result && result.data && result.data.content && result.data.content.length > 0) {
                if (document.querySelectorAll("#table-food tbody").lastElementChild) {
                    document.querySelectorAll("#table-food tbody").item(0).innerHTML = '';
                }
                document.querySelectorAll("#table-food tbody").item(0).innerHTML = renderListFood(result.data.content);
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
                        getListFood(page - 1);
                    }
                }
                $('#nextpage').bootstrapPaginator(options);
            }
            
        }
    },
        function(errorThrown){}
    );
}
getListFood();
function renderListFood(data) {
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
        htmlS += '<div class="d-flex align-items-center ' + colorStatusFood(e.status) + '">';
        htmlS += '<i class="bx bx-radio-circle-marked bx-burst bx-rotate-90 align-middle font-18 me-1"></i>';
        htmlS += '<span>' + convertStatusFood(e.status) +'</span>';
        htmlS += '</div>';
        htmlS += '</td>';
        htmlS += '<td>' + e.createdAt +'</td>';
        htmlS += '<td style="width: 55px;">';
        htmlS += '<div class="d-flex order-actions">';
        htmlS += '<a onclick="formUpdateFood(this, \'' + e.id + '\')"><i class="bx bx-edit"></i></a>';
        htmlS += '</div>';
        htmlS += '</td>';
        htmlS += '<td style="width: 55px;">';
        if (e.status == 1) {
            htmlS += '<div class="d-flex order-actions">';
            htmlS += "<a onclick=\"approvalFood(this, '" + e.id +"', '" + e.createdBy + "', '" + e.avatar + '\')"><i class="bx bx-check"></i></a>';
            htmlS += '</div>';
        }
        htmlS += '</td>';
        htmlS += '<td style="width: 55px;">';
        if (e.status == 1) {
            htmlS += '<div class="d-flex order-actions">';
            htmlS += "<a onclick=\"deleteFood(this, '" + e.id +"', '" + e.name +"', '" + e.categoryId + "', '" + e.avatar + "', '" + e.images + "', '" + e.description + "', '" + e.content + "', '" + e.expirationDate + '\')" class="' + (e.status === 0 ? 'd-none' : '') + '"><i class="bx bxs-trash"></i></a>';
            htmlS += '</div>';
        }
        htmlS += '</td></tr>';
        return htmlS;
    });
    return html.join("");
}

var idApproval;
function approvalFood(e, id, createdBy, avatar){
    idApproval = {
        ele: e.parentElement.parentElement.parentElement,
        id: id,
        createdBy: createdBy,
        avatar: avatar
    }
    $('#approvalFood').modal('show');
}
function onBrowseFood(){
    var arrId = [idApproval.id];
    var dataPost = {
        status: 2,
        arrId: JSON.stringify(arrId),
        updatedBy: objAccount.id
    };
    var today = new Date();
    var time = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    getConnectAPI('POST', `https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods/update-list-status`, JSON.stringify(dataPost), function(result){
        if (result && result.status == 200) {
            notification('success', result.message);
            $('#approvalFood').modal('hide');
            getListFood();
            Notification.send(parseInt(idApproval.createdBy), {
                sender: objAccount.id,
                idNotify: "",
                usernameaccount: "",
                foodid: parseInt(idApproval.id),
                avatar: idApproval.avatar,
                title: "Admin approved",
                message: "Time request: " + time,
                category: "food",
                status: 1,
            });
        }
    },
        function(errorThrown){}
    );
}
var objDelete;
function deleteFood(e, id, name, cateID, avatar, images, description, content, expirationDate) {
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
    $('#deleteFood').modal('show');
}
function onDeleteFood(){
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
    getConnectAPI('POST', `https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods/${objDelete.id}`, JSON.stringify(dataPost), function(result){
        if (result && result.status == 200) {
            notification('success', "Delete successfully!");
            $('#deleteFood').modal('hide');
            getListFood();
        }
    },
        function(errorThrown){}
    );
}

function convertStatusFood(status){
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

function colorStatusFood(status){
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
    if (id && arr_Category) {
        var find = arr_Category.find(function(e){return id == e.id});
        if (find) {
            text = find.name;
        }
    }
    return text;
}

function renderDropdowFilterCategory(){
    var html = '';
    html += '<a class="dropdown-item active" onclick="filterCategory(this)">All</a>';
    for (let index = 0; index < arr_Category.length; index++) {
        var element = arr_Category[index];
        html += '<a class="dropdown-item" onclick="filterCategory(this, \'' + element.id + '\')">'+ element.name +'</a>';
    }
    $('.filter-category .dropdown-menu').append(html);
}
renderDropdowFilterCategory();
var dataFindFood;
function formUpdateFood(e, id){
    $('#modalAddFood').modal('show');
    getConnectAPI('GET', 'http://hfb-t1098e.herokuapp.com/api/v1/hfb/foods/' + id, null, function(result){
        if (result && result.status == 200) {
            dataFindFood = result;
        }
    },
        function(errorThrown){}
    );
}
function saveUpdateFood(){
    // var name = document.getElementById("nameFood").value;
    // var categoryId = document.getElementById("category").value;
    // var expirationDate = document.getElementById("expirationDate").value;
    // var description = document.getElementById("description").value;
    // if (!expirationDate) {
    //     $(".alert-danger").alert();
    //     return false;
    //   }
    //   if (listImageFood.length == 0) {
    //     $(".alert-danger").alert();
    //     return false;
    //   }
    var expirationDate = $('#expirationDate').val();
    var dataPost = {
        name: name,
        avatar: dataFindFood.avatar,
        images: dataFindFood.images,
        expirationDate: expirationDate,
        updatedBy: objAccount.id,
        categoryId: dataFindFood.categoryId,
        description: dataFindFood.bootstrapPaginatordescription,
        manufactureDate: '',
        status: 1,
    }
    getConnectAPI('POST', 'http://localhost:8080/api/v1/hfb/foods/' + id, JSON.stringify(dataPost), function(result){
        if (result && result.status == 200) {
            $('#modalAddFood').modal('hide');
        }
    },
        function(errorThrown){}
    );
}