"use strict";
var objAccount = null;
var listImageFood = [];
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
//     if (listImageFood1.length == 0) {
//       $(".alert-danger").alert();
//       return false;
//     }
//     var description = document.getElementById("description").value;
//     var dataPost = {
//       name: nameFood || "",
//       avatar: listImageFood1[0],
//       images: listImageFood1.join(","),
//       expirationDate: document.getElementById("expirationDate").value,
//       createdBy: objAccount.id,
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
      document
        .getElementsByClassName("listFoodPost")[0]
        .classList.remove("d-none");

      document
        .getElementsByClassName("listFoodPending")[0]
        .classList.remove("d-none");

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
