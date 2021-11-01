// hoangtl2 - 01/11/2021 - food list pagination on account page
// start
var foodCount = 0;
var requestCount = 0;

var userID = document.getElementById("account_id").value;
var paginDiv = document.getElementById("pagination-button");

var foodDataTable = document.getElementById("food-data-table");

var foodListAPI =
  "https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods/search?status=2";

var shopItem = document.querySelector("#list-food");

function getListFood() {
  fetch(foodListAPI, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((listItems) => {
      renderListFood(listItems.data.content);
    })
    .catch((error) => console.log(error));
}
getListFood();

function renderListFood(listFood) {
  let container = $(".pagination1");
  container.pagination({
    dataSource: listFood,
    pageSize: 5,
    showGoInput: true,
    showGoButton: true,
    formatGoInput: "go to <%= input %>",
    callback: function (data, pagination) {
      var dataHtml = "<div>";
      $.each(data, function (index, e) {
        foodCount++;
        dataHtml +=
          `<tr id="food-row-${e.id}">
        <td>${e.id}</td>
        <td>${e.name || ""}</td>
        <td><img src="https://res.cloudinary.com/vernom/image/upload/${
          e.avatar
        }" style="width: 30px;height: 30px;"/></td>
        <td>${formatCategory(e.categoryId)}</td>
        <td>${e.expirationDate}</td>
        <td>${e.createdAt}</td>
        <td>${
          e.status == 0 ? "deactive" : e.status == 1 ? "pending" : "active"
        }</td>
        <td onclick="formUpdateFood()"><i class="fa fa-pencil-square-o"></i></td>` +
          `<td onclick=confirmDeleteFood(${e.id})><i class="fa fa-trash-o"></i></td></tr>`;
      });

      dataHtml += "</div>";
      $("#list-food").html(dataHtml);
    },
  });

  if (foodCount == 0) {
    foodDataTable.style.display = "none";
    document.getElementById("no-food-noti").removeAttribute("style");
    document
      .getElementById("center-noti")
      .setAttribute("style", "text-align: center;");
  }
}
//end

// hoangtl2 - 01/11/2021 - food list pagination on account page
// start
// update food
function formUpdateFood() {}

// display donate modal on click delete button
var modal3 = document.querySelector(".modal-account-confirm-delete");
function confirmDeleteFood(id) {
  modal3.style.display = "flex";
  var buttonValue = document.getElementById("accept-button");
  // console.log(id);
  buttonValue.setAttribute("onclick", "deleteFood(" + id + ")");
}

// delete food
function deleteFood(id) {
  var dataPost = {
    status: 0,
  };
  fetch(`https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods/status/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${isToken}`,
    },
    body: JSON.stringify(dataPost),
  })
    .then((response) => response.json())
    .then((food) => {
      if (food) {
        document.getElementById("food-row-" + id).style.display = "none";
        modal3.style.display = "none";
        swal("Success!", "Delete success!", "success");
        getListFood();
      }
    })
    .catch((error) => console.log(error));
}

// Close Modal by clicking "close" button
function cancelModal() {
  modal3.style.display = "none";
}

// Close Modal by clicking "esc" button
$(document).keydown(function (event) {
  if (event.keyCode == 27) {
    modal3.style.display = "none";
    event.preventDefault();
  }
});
// end

// hoangtl2 - 01/11/2021 - request list pagination on account page
// start
var requestListAPI = `https://hfb-t1098e.herokuapp.com/api/v1/hfb/requests?userId=${userID}&status=1`;

var requestItem = document.querySelector("#list-request");

function getListRequest() {
  fetch(requestListAPI, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${isToken}`,
    },
  })
    .then((response) => response.json())
    .then((food) => {
      if (
        food &&
        food.data &&
        food.data.content &&
        food.data.content.length > 0
      ) {
        document.querySelector("#list-request").innerHTML = renderListRequest(
          food.data.content
        );
      }
    })
    .catch((error) => console.log(error));
}
getListRequest();

// function getListRequest() {
//   fetch(
//     `https://hfb-t1098e.herokuapp.com/api/v1/hfb/requests?userId=${objAccount.id}&status=1`,
//     {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${isToken}`,
//       },
//     }
//   )
//     .then((response) => response.json())
//     .then((food) => {
//       if (
//         food &&
//         food.data &&
//         food.data.content &&
//         food.data.content.length > 0
//       ) {
//         document.querySelector("#list-request").innerHTML = renderListRequest(
//           food.data.content
//         );
//       }
//     })
//     .catch((error) => console.log(error));
// }

function renderListRequest(listRequest) {
  let container = $(".pagination2");
  container.pagination({
    dataSource: listRequest,
    pageSize: 5,
    showGoInput: true,
    showGoButton: true,
    formatGoInput: "go to <%= input %>",
    callback: function (data, pagination) {
      var dataHtml = "<div>";
      $.each(data, function (index, e) {
        requestCount++;
        dataHtml +=
          `<tr><td>${e.id}</td><td>${e.foodName || ""}</td><td>${
            e.message
          }</td><td>${e.supplierName}</td>` +
          "<td onclick=\"formDetailRequest('" +
          e.foodId +
          '\')"><i class="fa fa-pencil-square-o"></i></td><td onclick="deleteRequest(this, \'' +
          e.foodId +
          "', '" +
          e.message +
          "', '" +
          e.supplierId +
          "', '" +
          e.supplierName +
          '\')"><i class="fa fa-trash-o"></i></td></tr>';
      });

      dataHtml += "</div>";

      $("#list-request").html(dataHtml);
    },
  });
}
// end
