// hoangtl2 - 01/11/2021 - get data user
// start
var foodCount = 0;
var requestCount = 0;

var objAccount = null;

function initPageAccount() {
  getAccount();
}
initPageAccount();

function getAccount() {
  fetch(`https://hfb-t1098e.herokuapp.com/api/v1/hfb/users/${currentName}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${isToken}`,
    },
  })
    .then((response) => response.json())
    .then((account) => {
      if (account && account.data) {
        objAccount = account.data;
        getListFood(objAccount.id);
        getListRequest(objAccount.id);
        // console.log(objAccount.id);
        bindDataAccount(account.data);
      }
    })
    .catch((error) => console.log(error));
}

function bindDataAccount(data) {
  document.querySelector("#account_id").value = data.id;
  document.querySelector("#account_name").value = data.name;
  document.querySelector("#account_phone").value = data.phone;
  document.querySelector("#account_email").value = data.email;
  document.querySelector("#account_address").value = data.address;
  document.querySelector(".name-account").innerHTML = data.name;
  document.querySelector("#avatar_account").src =
    data.avatar ||
    "https://thumbs.dreamstime.com/b/user-icon-trendy-flat-style-isolated-grey-background-user-symbol-user-icon-trendy-flat-style-isolated-grey-background-123663211.jpg";
  document.querySelector("#avatar_account").parentElement.href =
    data.avatar ||
    "https://thumbs.dreamstime.com/b/user-icon-trendy-flat-style-isolated-grey-background-user-symbol-user-icon-trendy-flat-style-isolated-grey-background-123663211.jpg";
}
// end

// hoangtl2 - 01/11/2021 - food list pagination on account page
// start
function getListFood(userID) {
  var foodListAPI = `https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods/search?status=2&createdBy=${userID}`;
  fetch(foodListAPI, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((foodList) => {
      renderListFood(foodList.data.content);
    })
    .catch((error) => console.log(error));
}

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
        <td>${foodCount}</td>
        <td>${e.name || ""}</td>
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

  var foodDataTable = document.getElementById("food-data-table");

  if (foodCount == 0) {
    foodDataTable.style.display = "none";
    document.getElementById("no-food-noti").removeAttribute("style");
    document
      .getElementById("center-food-noti")
      .setAttribute("style", "text-align: center;");
  }
}

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
        getListFood(objAccount.id);
      }
    })
    .catch((error) => console.log(error));
}
// end

// hoangtl2 - 01/11/2021 - request list pagination on account page
// start
function getListRequest(userID) {
  // console.log(userID);
  var requestListAPI = `https://hfb-t1098e.herokuapp.com/api/v1/hfb/requests?userId=${userID}&status=1`;

  fetch(requestListAPI, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${isToken}`,
    },
  })
    .then((response) => response.json())
    .then((requestsList) => {
      if (
        requestsList &&
        requestsList.data &&
        requestsList.data.content &&
        requestsList.data.content.length > 0
      ) {
        renderListRequest(requestsList.data.content);
      }
    })
    .catch((error) => console.log(error));
}

function renderListRequest(listRequest) {
  let requestContainer = $(".pagination2");
  requestContainer.pagination({
    dataSource: listRequest,
    pageSize: 5,
    showGoInput: true,
    showGoButton: true,
    formatGoInput: "go to <%= input %>",
    callback: function (data, pagination) {
      var dataHtml1 = "<div>";
      $.each(data, function (index, e) {
        requestCount++;
        dataHtml1 +=
          `<tr id="request-row-${e.recipientId}"><td>${requestCount}</td><td>${
            e.foodName
          }</td><td>${e.supplierName}</td><td>${convertRequestStatus(
            e.status
          )}</td><td onclick="formDetailRequest(${
            e.foodId
          })"><i class="fa fa-pencil-square-o"></i></td>` +
          `<td onclick=confirmDeleteRequest(` +
          e.foodId +
          `)><i class="fa fa-trash-o"></i></td></tr>`;
      });

      dataHtml1 += "</div>";

      $("#list-request").html(dataHtml1);
    },
  });

  var requestDataTable = document.getElementById("request-data-table");

  if (requestCount == 0) {
    requestDataTable.style.display = "none";
    document.getElementById("no-request-noti").removeAttribute("style");
    document
      .getElementById("center-request-noti")
      .setAttribute("style", "text-align: center;");
  }
}

// display delete modal on click delete button
function confirmDeleteRequest(foodId) {
  modal3.style.display = "flex";
  var buttonValue = document.getElementById("accept-button");
  // console.log(id);
  buttonValue.setAttribute("onclick", `deleteRequest(` + foodId + `)`);
}

// delete food
function deleteRequest(foodId) {
  console.log(foodId);
  var dataPost = {
    status: 0,
    updatedBy: objAccount.id,
  };
  fetch(
    `https://hfb-t1098e.herokuapp.com/api/v1/hfb/requests/${objAccount.id}/
      ${foodId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${isToken}`,
      },
      body: JSON.stringify(dataPost),
    }
  )
    .then((response) => response.json())
    .then((request) => {
      if (request) {
        document.getElementById("request-row-" + objAccount.id).style.display =
          "none";
        modal3.style.display = "none";
        swal("Success!", "Delete success!", "success");
        getListRequest(objAccount.id);
      }
    })
    .catch((error) => console.log(error));
}
// end

// hoangtl2 - 01/10/2021 - close Modal by clicking "close" button
// start
function cancelModal() {
  modal3.style.display = "none";
}

// close Modal by clicking "esc" button
$(document).keydown(function (event) {
  if (event.keyCode == 27) {
    modal3.style.display = "none";
    event.preventDefault();
  }
});

// detail request
function formDetailRequest(id) {
  fetch(
    `https://hfb-t1098e.herokuapp.com/api/v1/hfb/requests/${objAccount.id}/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${isToken}`,
      },
    }
  )
    .then((response) => response.json())
    .then((food) => {
      if (food) {
        document
          .getElementsByClassName("listRequest")[0]
          .classList.remove("active");
        document.getElementById("listRequest").classList.remove("active");
        document
          .getElementsByClassName("detailRequest")[0]
          .classList.add("active");
        document.getElementById("detailRequest").classList.add("active");
        document
          .getElementsByClassName("detailRequest")[0]
          .classList.remove("d-none");
        bindDataDetailRequest(food.data);
      }
    })
    .catch((error) => console.log(error));
}

// bind data detail request
function bindDataDetailRequest(data) {
  var cloudinary_url = "https://res.cloudinary.com/vernom/image/upload/";
  document.getElementById(
    "image_food_detail_request"
  ).src = `${cloudinary_url}${data.foodDTO.avatar}`;
  document.getElementById("food-title").innerHTML = data.foodDTO.name;
  var message = data.message;
  document.getElementById("message").innerHTML = message;
  document.getElementById("request-status").innerHTML = convertRequestStatus(
    data.status
  );

  document
    .querySelectorAll("#detailRequest .row-btn")
    .item(
      0
    ).innerHTML = `<div class="col-sm-12"><a class="btn btn-sm btn-block btn-warning" onclick="updateRequestMessage(${data})"><i class="fa fa-edit"></i> Edit</a></div>`;
}

function updateRequestMessage(data) {
  var recipientMsg = document.getElementById("message").value;
  var dataPost = {
    supplierId: "",
    supplierName: "",
    message: recipientMsg,
    status: "",
    updatedBy: objAccount.id,
  };
  fetch(
    `https://hfb-t1098e.herokuapp.com/api/v1/hfb/requests/${objAccount.id}/${data.foodDTO.id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${isToken}`,
      },
      body: JSON.stringify(dataPost),
    }
  )
    .then((response) => response.json())
    .then((request) => {
      let editRequestPromise = new Promise(function (myResolve) {
        var msgRequest = request.data;
        myResolve();
      });
      if (request) {
        document
          .getElementsByClassName("listRequest")[0]
          .classList.remove("active");
        document.getElementById("listRequest").classList.remove("active");
        document
          .getElementsByClassName("detailRequest")[0]
          .classList.add("active");
        document.getElementById("detailRequest").classList.add("active");
        document
          .getElementsByClassName("detailRequest")[0]
          .classList.remove("d-none");
        bindDataDetailRequest(food.data);
      }
    })
    .catch((error) => console.log(error));
}

// convert request status
function convertRequestStatus(status) {
  switch (status) {
    case 0:
      status = "Deactive";
      break;
    case 1:
      status = "Pending";
      break;
    case 2:
      status = "Confirmed";
      break;
    case 3:
      status = "Done";
      break;
    case 4:
      status = "Cancel";
      break;
  }
  return status;
}
// end
