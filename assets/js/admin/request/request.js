var orderByRequest = 'asc', statusRequest = null, searchName_Request, filter_Category;
function formAddRequest() {
    document.getElementById('modalAddRequest').classList.add('show');
}
// save Request
function saveRequest(){
    var name = document.getElementById("nameRequest").value;
    var categoryId = document.getElementById("category").value;
    var expirationDate = document.getElementById("expirationDate").value;
    var description = document.getElementById("description").value;
    if (!expirationDate) {
        $(".alert-danger").alert();
        return false;
      }
      if (listImageRequest.length == 0) {
        $(".alert-danger").alert();
        return false;
      }
    
    var dataPost = {
        name: name,
        avatar: listImageRequest[0],
        images: listImageRequest.join(","),
        expirationDate: expirationDate,
        createdBy: objAccount.id,
        categoryId: categoryId,
        description: description
    }
    getConnectAPI('POST', 'https://hfb-t1098e.herokuapp.com/api/v1/hfb/Requests', JSON.stringify(dataPost), function(result){
        if (result && result.status == 200) {
            getListRequest();
            $('#modalAddRequest').modal('hide');
        }
    },
        function(errorThrown){}
    );
}
var pageSize = 10, pageIndex = 0;
// get data Request
function getListRequest(pageIndex) {
    if (!pageIndex) {
        pageIndex = 0;
    }
    var optionUrl = '';
    if (statusRequest) {
        optionUrl += '&status=' + parseInt(statusRequest);
    }
    if (orderByRequest) {
        optionUrl += '&order=' + orderByRequest;
    }
    optionUrl += '&sortBy=id';
    getConnectAPI('GET', 'https://hfb-t1098e.herokuapp.com/api/v1/hfb/requests?page=' + pageIndex + '&limit=' + pageSize + optionUrl, null, function(result){
        if (result && result.status == 200) {
            if (result && result.data && result.data.content && result.data.content.length > 0) {
                if (document.querySelectorAll("#table-Request tbody").lastElementChild) {
                    document.querySelectorAll("#table-Request tbody").item(0).innerHTML = '';
                }
                document.querySelectorAll("#table-Request tbody").item(0).innerHTML = renderListRequest(result.data.content);
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
                        getListRequest(page - 1);
                    }
                }
                $('#nextpage').bootstrapPaginator(options);
            }
            
        }
    },
        function(errorThrown){}
    );
}
getListRequest();
function renderListRequest(data) {
    var count = 0;
    var html = data.map(function (e) {
        count++;
        return (
            `<tr>
            <td>${count}</td>
            <td>${e.name || ""}</td>
            <td><img src="https://res.cloudinary.com/vernom/image/upload/${e.avatar}" style="width: 30px;height: 30px;"/></td>
            <td></td>
            <td>${e.expirationDate}</td>
            <td>
                <div class="d-flex align-items-center ${colorStatusRequest(e.status)}">
                    <i class='bx bx-radio-circle-marked bx-burst bx-rotate-90 align-middle font-18 me-1'></i>
					<span>${convertStatusRequest(e.status)}</span>
                </div>
            </td>
            <td>${e.createdAt}</td>
            <td >
                <div class="d-flex order-actions">
                    <a onclick="formUpdateRequest(this, ${e.id})"><i class='bx bx-edit' ></i></a>`
                    + "<a onclick=\"approvalRequest(this, '" + e.id +"', '" + e.createdBy + "', '" + e.avatar + '\')" class="ms-4"><i class="bx bx-check"></i></a>'
                    + "<a onclick=\"deleteRequest(this, '" + e.id +"', '" + e.name +"', '"
                    + e.categoryId + "', '" + e.avatar + "', '" + e.images + "', '" + e.description + "', '" 
                    + e.content + "', '" + e.expirationDate + '\')" class="ms-4"><i class="bx bxs-trash"></i></a>' +
                `</div>
            </td></tr>`
            );
        });
    return html.join("");
}
var orderBy = 'asc'
function onChangeOrderBy(e, type){
    orderBy = type;
    e.classList.add('active')
}
var idApproval;
function approvalRequest(e, id, createdBy, avatar){
    idApproval = {
        ele: e.parentElement.parentElement.parentElement,
        id: id,
        createdBy: createdBy,
        avatar: avatar
    }
    $('#approvalRequest').modal('show');
}
function onBrowseRequest(){
    var dataPost = {
        status: 2
    };
    var today = new Date();
    var time = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    http://hfb-t1098e.herokuapp.com/api/v1/hfb/requests/status/4/5
    getConnectAPI('POST', `https://hfb-t1098e.herokuapp.com/api/v1/hfb/Requests/status/${idApproval.id}`, JSON.stringify(dataPost), function(result){
        if (result && result.status == 200) {
            Notification.send(parseInt(idApproval.createdBy), {
                sender: objAccount.id,
                idNotify: "",
                usernameaccount: "",
                Requestid: parseInt(idApproval.id),
                avatar: idApproval.avatar,
                title: "Admin approved",
                message: "Time request: " + time,
                category: "Request",
                status: 1,
            });
            $('#approvalRequest').modal('hide');
            getListRequest();
            
        }
    },
        function(errorThrown){}
    );
}
var objDelete;
function deleteRequest(e, id, name, cateID, avatar, images, description, content, expirationDate) {
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
    $('#deleteRequest').modal('show');
}
function onDeleteRequest(){
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
    getConnectAPI('POST', `https://hfb-t1098e.herokuapp.com/api/v1/hfb/Requests/${objDelete.id}`, JSON.stringify(dataPost), function(result){
        if (result && result.status == 200) {
            objDelete.ele.remove();
            $('#deleteRequest').modal('hide');
            getListRequest();
        }
    },
        function(errorThrown){}
    );
}

function convertStatusRequest(status){
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

function colorStatusRequest(status){
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