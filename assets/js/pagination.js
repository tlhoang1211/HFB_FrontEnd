function paginationFood(listFood) {
  let container = $(".pagination");
  container.pagination({
    dataSource: listFood,
    pageSize: 8,
    showGoInput: true,
    showGoButton: true,
    formatGoInput: "go to <%= input %>",
    callback: function (data, pagination) {
      let paginationFoodPromise = new Promise(function (myResolve) {
        var dataHtml = "<div>";

        $.each(data, function (index, item) {
          dataHtml += `<div class="col-sm-6 col-md-3 col-lg-3" style="min-height: 350px;" id="pg-shop-item-${item.id}">
                    <div class="shop-item">
                        <div class="shop-item-image"><img class="img-food" src="https://res.cloudinary.com/vernom/image/upload/${item.avatar}" class="img-food" alt="Cold Garb"/>
                        <div class="shop-item-detail"><a class="btn btn-round btn-b" href="./shop_single_product.html?id=${item.id}"><span class="icon-basket">View Details</span></a></div>
                        </div>
                        <h4 class="shop-item-title font-alt"><a href="#">${item.name}</a></h4>
                        <p>Expiration Date: ${item.expirationDate}</p>
                    </div>
                    </div>`;
        });

        dataHtml += "</div>";

        $("#data-container").html(dataHtml);
        myResolve();
      });
            paginationFoodPromise.then(
                function() { 
                  data.map(function(item2){
                    var tet = getTimeFromString3(item2.expirationDate);
                    run();
                    
                    // Tổng số giây 
                    var countDown = setInterval(run,1000);
                    function run(){
                        var now = new Date().getTime();
                        var timeRest = tet - now;
                        if(timeRest <= 0){
                            clearInterval(countDown);
                            document.querySelector(`#pg-shop-item-${item2.id}`).style.display = 'none';

                            var urlUpdateStatus = `https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods/status/${item2.id}`;
                            fetch(urlUpdateStatus, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                status: 0
                            }),
                            })
                            .then((response) => response.json())
                            .then((data) => {
                                getListItem();
                            })
                            .catch(error => console.log(error));
                        }
                    }
                  })
                }
            );
        }
    })
  }

function getTimeFromString3(strDate) {
  var arrDate = strDate.split("/");
  var year = parseInt(arrDate[2]);
  var month = parseInt(arrDate[1]) - 1;
  var date = parseInt(arrDate[0]);
  return new Date(year, month, date).getTime();
}
