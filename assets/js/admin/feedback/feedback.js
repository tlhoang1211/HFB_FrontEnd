var orderBy = 'asc', statusFeedback = null, searchName_Feedback, objDetail;

function onChangeOrderByFeedback(e, type){
    orderBy = type;
    addActive(e);
    getListFeedback();
}
function searchNameFeedback(ele, e){
    searchName_Feedback = $(ele).val();
    if (e) {
        if (e.keyCode == 13) {
            getListFeedback();
            return false;
        }
    } else {
        getListFeedback();
    }
}
// get data Feedback
function getListFeedback(pageIndex) {
    if (!pageIndex) {
        pageIndex = 0;
    }
    var optionUrl = '';
    if (orderBy) {
        optionUrl += '&order=' + orderBy;
    }
    optionUrl += '&sortBy=id';
    if (searchName_Feedback) {
        optionUrl += '&name=' + searchName_Feedback;
    }
    // ?name=&phone=&amount=&startCreated=2021-11-01&endCreated=2021-11-04&status=1&page=0&limit=10&sortBy=id&order=desc
    getConnectAPI('GET', 'https://hfb-t1098e.herokuapp.com/api/v1/hfb/donations/search?page=' + pageIndex + '&limit=' + pageSize + optionUrl, null, function(result){
        if (result && result.status == 200) {
            if (result && result.data && result.data.content) {
                if (result.data.content.length > 0) {
                    if (document.querySelectorAll("#table-Feedback tbody").lastElementChild) {
                        document.querySelectorAll("#table-Feedback tbody").item(0).innerHTML = '';
                    }
                    document.querySelectorAll("#table-Feedback tbody").item(0).innerHTML = renderListFeedback(result.data.content);
                    $('#table-Feedback').removeClass('d-none');
                    $('.axbox-footer').removeClass('d-none');
                    $('.zero-warning').addClass('d-none');
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
                            getListFeedback(page - 1);
                        }
                    }
                    $('#nextpage').bootstrapPaginator(options);
                } else {
                    $('#table-Feedback').addClass('d-none');
                    $('.axbox-footer').addClass('d-none');
                    $('.zero-warning').removeClass('d-none');
                }
            }
        }
    },
        function(errorThrown){}
    );
}
getListFeedback();
function renderListFeedback(data) {
    var count = 0;
    var html = data.map(function (e) {
        count++;
        var htmlS = '';
        htmlS += '<tr>';
        htmlS += '<td>' + count + '</td>';
        htmlS += '<td>'+ (e.name || '') +'</td>';
        htmlS += '<td class="text-end">' + (e.amount || 0) + ' $</td>';
        htmlS += '<td>' + (e.content || '') + '</td>';
        htmlS += '<td>' + (e.phone || "") + '</td>';
        htmlS += '<td>' + (e.createdAt) +'</td>';
        htmlS += '<td><button type="button" class="btn btn-light btn-sm radius-30 px-4" onclick="viewDetailsFeedback(this, \''+ e.id +'\')">View Details</button></td>';
        htmlS += '</tr>';
        return htmlS;
    });
    return html.join("");
}

function viewDetailsFeedback(e, id){
    $('#modal-detail-Feedback').modal('show');
    getConnectAPI('GET', 'https://hfb-t1098e.herokuapp.com/api/v1/hfb/donations/' + id, null, function(result){
        if (result && result.status == 200) {
            if (result.data) {
                $('#name_Feedback, .name_Feedback').text(result.data.name ? result.data.name : '*******');
                $('#amount_Feedback').text(result.data.amount ? result.data.amount : '*******');
                $('#mobile_Feedback').text(result.data.phone ? result.data.phone : '*******');
                $('#content_Feedback').text(result.data.content ? result.data.content : '*******');
                $('#date_Feedback').text(result.data.createdAt ? result.data.createdAt : '*******');
            }
        }
    },
        function(errorThrown){}
    );
}