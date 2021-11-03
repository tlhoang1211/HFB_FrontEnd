// hoangtl2 - 01/11/2021 - get data user
// start
var foodCount = 0;
var requestCount = 0;

var objAccount = null;

var cloudinary_url = "https://res.cloudinary.com/vernom/image/upload/";

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
        <td onclick="formUpdateFood(${
          e.id
        })"><i class="fa fa-pencil-square-o"></i></td>` +
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

var editImageFood = document.querySelector(".view-image-product");
var editInfoFood = document.querySelector(".view-info-product");
var editContentDesFood = document.querySelector(".view-info-des-content");
var editUser = document.querySelector(".editUser");
var listFood = document.querySelector(".listFood");
var listFoodPagination = document.querySelector(".listFoodPagination");
editUser.style.display = "none";
var infoFoodDetail;
function formUpdateFood(id) {
  editUser.style.display = "block";
  listFood.style.display = "none";
  listFoodPagination.style.display = "none";

  var getDetailFood = `https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods/${id}`;
  fetch(getDetailFood, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((foodInfo) => {
      let editFoodPromise = new Promise(function (myResolve) {
        infoFoodDetail = foodInfo.data;
        myResolve();
      });
      editFoodPromise.then(function () {
        var htmls = `
      <div class="row multi-columns-row" >
        <div class="slider-image">
          <div class="slider-info-food">
            <img src="https://res.cloudinary.com/vernom/image/upload/${foodInfo.data.avatar}" style="width:100%; max-height: 450px">
          </div>
        </div>
      </div>
      `;

        var htmlsInfoProduct = `
        <div class="row">
          <div class="col-sm-12">
            <h3 class="product-title font-alt">${foodInfo.data.name}</h6>
          </div>
        </div>
        <div class="row mb-20">
          <div class="col-sm-12">
            <p style="font-size: 12px; color: #000; margin: 0;">Expiration Date: ${foodInfo.data.expirationDate}</p>
          </div>
        </div>
        <div class="row mb-20">
          <div class="col-sm-12">
            <div class="product_meta">Categories:<a href="#"> ${foodInfo.data.category}</a>
            </div>
          </div>
        </div>
      `;

        var htmlsDes = `
      <div class="row multi-columns-row" >
      <div class="col-sm-12" style="padding: 0;">
        <p>Description: ${foodInfo.data.description}</p>
      </div>
      </div>
      <div class="row multi-columns-row" >
        <div class="col-sm-12" style="padding: 0;">
          <p>Content: ${foodInfo.data.content}</p>
        </div>
      </div>
      `;

        editImageFood.innerHTML = htmls;
        editInfoFood.innerHTML = htmlsInfoProduct;
        editContentDesFood.innerHTML = htmlsDes;
      });

      document.getElementById("nameFoodEdit").value = foodInfo.data.name;
      document.getElementById("categoryEdit").value = formatCategoryStringToInt(
        foodInfo.data.category
      );
      document.getElementById(
        "expirationDateEdit"
      ).value = foodInfo.data.expirationDate.split("/").reverse().join("-");
      document.getElementById("descriptionEdit").value =
        foodInfo.data.description;
      document.getElementById("contentEdit").value = foodInfo.data.content;
    })
    .catch((error) => console.log(error));
}

function backToFoodList() {
  editUser.style.display = "none";
  listFood.style.display = "block";
  listFoodPagination.style.display = "block";
}

// validate form
$("#editformEdit").validate({
  onfocusout: false,
  onkeyup: false,
  onclick: false,
  rules: {
    nameFoodEdit: {
      // name element not id
      required: true,
    },
    categoryEdit: {
      required: true,
    },
    expirationDateEdit: {
      required: true,
    },
    descriptionEdit: {
      required: true,
    },
    contentEdit: {
      required: true,
    },
  },
  messages: {
    nameFoodEdit: {
      required: "Please provide name food.",
    },
    categoryEdit: {
      required: "Please choose category.",
    },
    expirationDateEdit: {
      required: "Please provide expiration date.",
    },
    descriptionEdit: {
      required: "Please provide description.",
    },
    contentEdit: {
      required: "Please provide content.",
    },
  },
});
var listImageFood = [];

function newFoodEdit() {
  var nameFood = document.getElementById("nameFoodEdit").value;
  var category = document.getElementById("categoryEdit").value;
  var expirationDate = document.getElementById("expirationDateEdit").value;
  var description = document.getElementById("descriptionEdit").value;
  var content = document.getElementById("contentEdit").value;

  if (
    !nameFood == false &&
    !category == false &&
    !expirationDate == false &&
    !description == false &&
    !content == false
  ) {
    if (listImageFood.length > 3) {
      swal("Warning!", "You should only add a maximum of 3 images!", "warning");
      console.log(listImageFood.length);
    } else {
      var dataPost;
      if (listImageFood.length == 0) {
        if (
          nameFood == infoFoodDetail.name &&
          category == formatCategoryStringToInt(infoFoodDetail.category) &&
          expirationDate ==
            infoFoodDetail.expirationDate.split("/").reverse().join("-") &&
          description == infoFoodDetail.description &&
          content == infoFoodDetail.content
        ) {
          swal("Warning!", "You haven't updated food information!", "warning");
        } else {
          dataPost = {
            name: nameFood || "",
            avatar: infoFoodDetail.avatar,
            images: infoFoodDetail.images,
            expirationDate: expirationDate,
            updatedBy: objAccount.id,
            categoryId: parseInt(category),
            description: description,
            content: content,
            status: 1,
          };
        }
      } else {
        if (
          nameFood == infoFoodDetail.name &&
          category == formatCategoryStringToInt(infoFoodDetail.category) &&
          expirationDate ==
            infoFoodDetail.expirationDate.split("/").reverse().join("-") &&
          description == infoFoodDetail.description &&
          content == infoFoodDetail.content &&
          listImageFood.join(",") == infoFoodDetail.images
        ) {
          swal("Warning!", "You haven't updated food information!", "warning");
        } else {
          dataPost = {
            name: nameFood || "",
            avatar: listImageFood[0],
            images: listImageFood.join(","),
            expirationDate: expirationDate,
            updatedBy: objAccount.id,
            categoryId: parseInt(category),
            description: description,
            content: content,
            status: 1,
          };
        }
      }
      if (!dataPost == false) {
        fetch(
          `https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods/${infoFoodDetail.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(dataPost),
          }
        )
          .then((response) => response.json())
          .then(function (data1) {
            console.log(data1.data);
            fetch(
              `https://hfb-t1098e.herokuapp.com/api/v1/hfb/users?role=ROLE_ADMIN`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
              .then((response) => response.json())
              .then((listAdmin) => {
                var listAdmin2;
                var idFood;
                var avatarFood;
                var time;
                let notifyFoodPromise = new Promise(function (myResolve) {
                  listAdmin2 = listAdmin.data;
                  idFood = data1.data.id;
                  avatarFood = data1.data.avatar;
                  var today = new Date();
                  time =
                    today.getDate() +
                    "-" +
                    (today.getMonth() + 1) +
                    "-" +
                    today.getFullYear() +
                    " " +
                    today.getHours() +
                    ":" +
                    today.getMinutes() +
                    ":" +
                    today.getSeconds();
                  myResolve();
                });
                notifyFoodPromise.then(function () {
                  listAdmin2.map(function (admin) {
                    Notification.send(admin.id, {
                      idNotify: "",
                      usernameaccount: admin.username,
                      foodid: idFood,
                      avatar: avatarFood,
                      title:
                        "User " +
                        objAccount.name +
                        " has just updated the food information",
                      message: "Time request: " + time,
                      category: "food",
                      status: 1,
                    });
                  });
                });
              })
              .catch((error) => console.log(error));
            swal("Success!", "Successfully updated data!", "success");

            modal1.style.display = "none";
            var frm = document.getElementsByName("upload_new_food_form")[0];
            frm.reset();
            var image1 = document.getElementsByClassName(
              "cloudinary-thumbnails"
            );
            image1.parentNode.removeChild(image1);
          })
          .catch((error) => console.log(error));
      }
    }
  }
}

var myWidgetFood = cloudinary.createUploadWidget(
  {
    cloudName: "vernom",
    uploadPreset: "fn5rpymu",
    form: "#editformEdit",
    folder: "hanoi_food_bank_project/uploaded_food",
    fieldName: "thumbnailsFoodEdit[]",
    thumbnails: ".thumbnailsFoodEdit",
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      listImageFood.push(result.info.path);
      var arrayThumnailInputs = document.querySelectorAll(
        'input[name="thumbnailsFoodEdit[]"]'
      );
      for (let i = 0; i < arrayThumnailInputs.length; i++) {
        arrayThumnailInputs[i].value = arrayThumnailInputs[i].getAttribute(
          "data-cloudinary-public-id"
        );
      }
    }
  }
);

document.getElementById("upload_image_foodEdit").addEventListener(
  "click",
  function () {
    myWidgetFood.open();
  },
  false
);

$("body").on("click", ".cloudinary-delete-edit", function () {
  var splittedImg = $(this).parent().find("img").attr("src").split("/");
  var imgName =
    splittedImg[splittedImg.length - 3] +
    "/" +
    splittedImg[splittedImg.length - 2] +
    "/" +
    splittedImg[splittedImg.length - 1];
  var publicId = $(this).parent().attr("data-cloudinary");
  $(this).parent().remove();
  var imgName2 =
    splittedImg[splittedImg.length - 4] +
    "/" +
    splittedImg[splittedImg.length - 3] +
    "/" +
    splittedImg[splittedImg.length - 2] +
    "/" +
    splittedImg[splittedImg.length - 1];

  for (let i = 0; i < listImageFood.length; i++) {
    if (listImageFood[i] == imgName2) {
      listImageFood.splice(i, 1);
    }
  }
  $(`input[data-cloudinary-public-id="${imgName}"]`).remove();
});

function formatCategory(id) {
  var text = "";
  switch (id) {
    case 1:
      text = "Drinks";
      break;
    case 2:
      text = "Noodle";
      break;
    case 3:
      text = "Bread";
      break;
    case 4:
      text = "Rice";
      break;
    case 5:
      text = "Meat";
      break;
    case 6:
      text = "Seafood";
      break;
    case 7:
      text = "Vegetables";
      break;
    case 8:
      text = "Vegetarian Food";
      break;
    case 9:
      text = "Fruit";
      break;
    case 10:
      text = "Fast Food";
      break;
    case 11:
      text = "Snacks";
      break;
    case 12:
      text = "Others";
      break;
  }
  return text;
}

function formatCategoryStringToInt(category) {
  var text;
  switch (category) {
    case "Drinks":
      text = 1;
      break;
    case "Noodle":
      text = 2;
      break;
    case "Bread":
      text = 3;
      break;
    case "Rice":
      text = 4;
      break;
    case "Meat":
      text = 5;
      break;
    case "Seafood":
      text = 6;
      break;
    case "Vegetables":
      text = 7;
      break;
    case "Vegetarian Food":
      text = 8;
      break;
    case "Fruit":
      text = 9;
      break;
    case "Fast Food":
      text = 10;
      break;
    case "Snacks":
      text = 11;
      break;
    case "Others":
      text = 12;
      break;
  }
  return text;
}

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
  // console.log(requestListAPI);
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
          }</td><td id="supplier-name">${
            e.supplierName
          }</td><td>${convertRequestStatus(
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
    .getElementsByClassName("row-btn")
    .item(
      0
    ).innerHTML = `<div class="col-sm-12"><input id="old-message" style="display:none" value="${message}"/><button type="button" class="btn btn-sm btn-block btn-warning" onclick="updateRequestMessage(${data.foodDTO.id}, ${data.foodDTO.createdBy})"><i class="fa fa-edit"></i> Update Message</button></div><div class="col-sm-12">
    <a onclick="backToRequestList()" type="button" lass="btn btn-sm btn-round" style="padding: 6px 0px 0px 0px !important">
    <i class="fa fa-angle-double-left"></i> Back to list</a></div>`;
}

function updateRequestMessage(foodID, supplierID) {
  var recipientMsg = document.getElementById("message").value;
  var oldMsg = document.getElementById("old-message").value;
  var supName = document.getElementById("supplier-name").innerText;
  if (recipientMsg.length != 0) {
    if (recipientMsg == oldMsg) {
      swal("Warning!", "You haven't changed the message field!", "warning");
    } else {
      var dataPost = {
        supplierId: supplierID,
        supplierName: supName,
        message: recipientMsg,
        updatedBy: objAccount.id,
        status: 1,
      };
      fetch(
        `https://hfb-t1098e.herokuapp.com/api/v1/hfb/requests/${objAccount.id}/${foodID}`,
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
        .then(function (request) {
          fetch(
            `https://hfb-t1098e.herokuapp.com/api/v1/hfb/users/${supName}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
            .then((response) => response.json())
            .then((supData) => {
              var supplier;
              var idFood;
              var avatarFood;
              var time;
              var requestData = request.data;
              console.log(supData.data);
              console.log(requestData);
              let notifyRequestPromise = new Promise(function (myResolve) {
                supplier = supData.data;
                idFood = requestData.foodId;
                avatarFood = cloudinary_url + requestData.foodDTO.avatar;
                var today = new Date();
                time =
                  today.getDate() +
                  "-" +
                  (today.getMonth() + 1) +
                  "-" +
                  today.getFullYear() +
                  " " +
                  today.getHours() +
                  ":" +
                  today.getMinutes() +
                  ":" +
                  today.getSeconds();
                myResolve();
              });
              notifyRequestPromise.then(function () {
                Notification.send(supplier.id, {
                  idNotify: "",
                  usernameaccount: supplier.name,
                  foodid: idFood,
                  avatar: avatarFood,
                  title:
                    "User " +
                    objAccount.name +
                    "has just updated request message",
                  message: "Time request: " + time,
                  category: "food",
                  status: 1,
                });
              });
            })
            .catch((error) => console.log(error));
          swal("Success!", "Successfully updated message!", "success");
        });
    }
  } else {
    swal("Warning!", "You cannot leave the message blank!", "warning");
  }
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

// back button
function backToRequestList() {
  document
    .getElementsByClassName("detailRequest")[0]
    .classList.remove("active");
  document.getElementById("detailRequest").classList.remove("active");
  document.getElementsByClassName("listRequest")[0].classList.add("active");
  document.getElementById("listRequest").classList.add("active");
  document.getElementsByClassName("listRequest")[0].classList.remove("d-none");
}
// end
