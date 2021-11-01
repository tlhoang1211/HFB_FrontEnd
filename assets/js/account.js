"use strict";
var objAccount = null;
var listImageFood = [];
// function initPageAccount() {
//   getAccount();
// }
// initPageAccount();
// Validator register
Validator({
  form: "#addneworder",
  formGroupSelector: ".form-group",
  errorSelector: ".form-message",
  rules: [
    Validator.isRequired("#nameFood", "Food name is required!"),
    Validator.isRequired("#category", "Category is required!"),
    Validator.isRequired("#manufactureDate", "Manufacture Date is required!"),
    Validator.isRequired("#expirationDate", "Expiration Date is required!"),
    Validator.isRequired("#description", "Description is required!"),
  ],
});

// document.getElementById("newFood").addEventListener(
//   "click",
//   function () {
//     var nameFood = document.getElementById("nameFood").value;
//     var category = document.getElementById("category").value;

//     var expirationDate = document.getElementById("expirationDate").value;
//     if (!expirationDate) {
//       $(".alert-danger").alert();
//       return false;
//     }
//     if (listImageFood.length == 0) {
//       $(".alert-danger").alert();
//       return false;
//     }
//     var description = document.getElementById("description").value;

//     var dataPost = {
//       name: nameFood || "",
//       avatar: listImageFood[0],
//       images: listImageFood.join(","),
//       expirationDate: document.getElementById("expirationDate").value,
//       createdBy: userID,
//       categoryId: parseInt(category),
//       description: description,
//     };
//     fetch("https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${isToken}`,
//       },
//       body: JSON.stringify(dataPost),
//     })
//       .then((response) => response.json())
//       .then(function (data) {})
//       .catch(function (error) {});
//   },
//   false
// );

// hiennv 24/10
// ********* active
function onAddClassActive(e, className, parent) {
  var listAction = document.getElementsByClassName(className);
  if (listAction && listAction.length > 0) {
    for (let index = 0, len = listAction.length; index < len; index++) {
      var element = listAction[index];
      element.classList.remove("active");
    }
  }
  if (parent) {
    e.parentElement.classList.add("active");
  } else {
    e.classList.add("active");
  }
}

function showTabPanel(e) {
  var listAction = document.getElementsByClassName("tab-account");
  if (listAction && listAction.length > 0) {
    for (var index = 0, len = listAction.length; index < len; index++) {
      var element = listAction[index];
      element.classList.add("d-none");
      element.classList.remove("active");
    }
  }
  var listPanel = document.getElementsByClassName("tab-pane");
  if (listPanel && listPanel.length > 0) {
    for (var index = 0, len = listPanel.length; index < len; index++) {
      var element = listPanel[index];
      element.classList.remove("active");
    }
  }
  switch (e) {
    case "myaccount":
      document.getElementsByClassName("profile")[0].classList.add("active");
      document.getElementById("profile").classList.add("active");
      document.getElementsByClassName("profile")[0].classList.remove("d-none");
      getAccount();
      break;
    case "myfood":
      // document.getElementsByClassName("addFood")[0].classList.add("active");
      // document.getElementById("formAddFood").classList.add("active");
      // document.getElementsByClassName("addFood")[0].classList.remove("d-none");
      document.getElementsByClassName("listFood")[0].classList.add("active");
      document.getElementById("listFood").classList.add("active");
      document.getElementsByClassName("listFood")[0].classList.remove("d-none");
      break;
    case "myrequest":
      document.getElementsByClassName("listRequest")[0].classList.add("active");
      document.getElementById("listRequest").classList.add("active");
      document
        .getElementsByClassName("listRequest")[0]
        .classList.remove("d-none");
      break;
    case "myfeedback":
      document.getElementsByClassName("feedback")[0].classList.add("active");
      document.getElementById("feedback").classList.add("active");
      document.getElementsByClassName("feedback")[0].classList.remove("d-none");
      break;
    default:
      break;
  }
}

// update profile
function updateAccount() {
  // var obj = {
  // }
  // fetch(`https://hfb-t1098e.herokuapp.com/api/v1/hfb/users/${currentName}`,{
  //   method: 'GET',
  //   headers: {
  //     "Authorization":`Bearer ${isToken}`
  //   }
  // })
  // .then(response => response.json())
  // .then(account => {
  //   if (account && account.data) {
  //     objAccount = account.data;
  //     bindDataAccount(account.data);
  //   }
  // })
  // .catch(error => console.log(error));
}

// format category
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
          .getElementsByClassName("detailRequest")[0]
          .classList.remove("d-none");
        bindDataDetailRequest(food.data);
      }
    })
    .catch((error) => console.log(error));
}

// bind data detail request
function bindDataDetailRequest(data) {
  document.querySelectorAll("#image_food_detail_request").src =
    data.avatar ||
    "https://res.cloudinary.com/vernom/image/upload/v1633964280/hanoi_food_bank_project/uploaded_food/Fruit/apple1.jpg";
  document.querySelectorAll("#detailRequest .product-title").item(0).innerHTML =
    data.foodDTO.name;
  document.querySelectorAll("#detailRequest .description p").item(0).innerHTML =
    data.message;
  document
    .querySelectorAll("#detailRequest .product_meta a")
    .item(0).innerHTML = convertStatus(data.status);
  document
    .querySelectorAll("#detailRequest .row-btn")
    .item(
      0
    ).innerHTML = `<div class="col-sm-6"><a class="btn btn-sm btn-block btn-warning" onclick="editRequest()"><i class="fa fa-edit"></i> Edit</a></div>
	<div class="col-sm-6"><a class="btn btn-sm btn-block btn-danger" onclick="deleteRequestInDetail()"><i class="fa fa-trash-o"></i> Delete</a></div>`;
}

// delete request
function deleteRequest(e, id, message, supplierId, supplierName) {
  var dataPost = {
    message: message || "",
    status: 0,
    supplierId: supplierId,
    supplierName: supplierName,
    updatedBy: objAccount.id,
  };
  fetch(
    `https://hfb-t1098e.herokuapp.com/api/v1/hfb/requests/${objAccount.id}/${id}`,
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
    .then((food) => {
      if (food) {
        e.parentElement.remove();
      }
    })
    .catch((error) => console.log(error));
}

// convert status
function convertStatus(status) {
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
