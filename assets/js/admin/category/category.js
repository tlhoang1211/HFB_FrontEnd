
    function formAddCategory() {
        $('#modalAddCategory').modal('show');
    }
    // save food
    function saveCategory(){
        var name = document.getElementById("nameFood").value;
        var categoryId = document.getElementById("category").value;
        var expirationDate = document.getElementById("expirationDate").value;
        var description = document.getElementById("description").value;
        if (!expirationDate) {
            $(".alert-danger").alert();
            return false;
          }
          if (listImageFood.length == 0) {
            $(".alert-danger").alert();
            return false;
          }
        
        var dataPost = {
            name: name,
            avatar: listImageFood[0],
            images: listImageFood.join(","),
            expirationDate: expirationDate,
            createdBy: objAccount.id,
            categoryId: categoryId,
            description: description
        }
        getConnectAPI('POST', 'https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods', JSON.stringify(dataPost), function(result){
            if (result && result.status == 200) {
                getListFood();
                $('#modalAddFood').modal('hide');
            }
        },
            function(errorThrown){}
        );
    }
    var pageSize = 10, pageIndex = 0;
    // get data food
    function getListFood(pageIndex) {
        if (!pageIndex) {
            pageIndex = 0;
        }
        var optionUrl = '';
        getConnectAPI('GET', 'https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods/search?status=1&page=' + pageIndex + '&limit=' + (pageIndex === 0 ? pageSize : (pageIndex * pageSize)), null, function(result){
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
            return (
                `<tr>
                <td>${count}</td>
                <td>${e.name || ""}</td>
                <td><img src="https://res.cloudinary.com/vernom/image/upload/${e.avatar}" style="width: 30px;height: 30px;"/></td>
                <td></td>
                <td>${e.expirationDate}</td>
                <td>
                    <div class="d-flex align-items-center ${colorStatusFood(e.status)}">
                        <i class='bx bx-radio-circle-marked bx-burst bx-rotate-90 align-middle font-18 me-1'></i>
                                            <span>${convertStatusFood(e.status)}</span>
                    </div>
                </td>
                <td>${e.createdAt}</td>
                <td >
                    <div class="d-flex order-actions">
                        <a onclick="formUpdateFood(this, ${e.id})"><i class='bx bx-edit' ></i></a>`
                        + "<a onclick=\"approvalFood(this, '" + e.id +"', '" + e.createdBy + "', '" + e.avatar + '\')" class="ms-4"><i class="bx bx-check"></i></a>'
                        + "<a onclick=\"deleteFood(this, '" + e.id +"', '" + e.name +"', '"
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
        $('#deleteCategory').modal('show');
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
                objDelete.ele.remove();
                $('#deleteFood').modal('hide');
                getListFood();
            }
        },
            function(errorThrown){}
        );
    }
    
    function convertStatusCategory(status){
        var text = '';
        switch (status) {
            case 0:
                text = 'Deactive';
                break;
            case 1:
                text = 'Active';
                break;
            default:
                text = 'Active';
                break;
        }
        return text;
    }
    
    function colorStatusCategory(status){
        var color = '';
        switch (status) {
            case 0:
                color = 'text-danger';
                break;
            case 1:
                color = 'text-success';
                break;
            default:
                color = 'text-danger';
                break;
        }
        return color;
    }