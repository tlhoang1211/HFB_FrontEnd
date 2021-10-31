$(document).ready(function () {
  Notification.config();
});

document.getElementById("logout").addEventListener("click", logoutAccount);
var loginregister = document.querySelector("#login-register");
var useraccount = document.querySelector("#user-account");
var notifycation = document.querySelector(".navbar__item--has-notify");

var token = null;
var usernameAccount = null;
var idAccount;
var objAccount = null;

// logout
function logoutAccount() {
  document.cookie = `token=${token}; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
  document.cookie = `username=${usernameAccount}; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
  token = null;
  usernameAccount = null;

  if (location.href == "http://127.0.0.1:5500/tabs_and_accordions.html") {
    location.replace("../index_shop.html");
  } else {
    location.reload();
  }
}

useraccount.style.display = "none";
notifycation.style.display = "none";

if (document.cookie != null && document.cookie != "") {
  var pairs = document.cookie.split(";");
  var cookies = {};
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split("=");
    cookies[(pair[0] + "").trim()] = unescape(pair.slice(1).join("="));
  }
  token = cookies.token;
  usernameAccount = cookies.username;
}
var getDetailAccount = `https://hfb-t1098e.herokuapp.com/api/v1/hfb/users/${usernameAccount}`;
if (token === null || token === undefined || token === NaN || token === "") {
  loginregister.style.display = "block";
  useraccount.style.display = "none";
  notifycation.style.display = "none";
} else {
  loginregister.style.display = "none";
  useraccount.style.display = "block";
  notifycation.style.display = "block";

  var viewAccount = document.querySelector(".navbar__user");
  var userName = document.querySelector(".hi-name");
  fetch(getDetailFood, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((account) => {
      objAccount = account.data;
      // if (objAccount.avatar == "") {
      var htmlsItem = `
        <img style="width: 30px; height: 30px; border-radius: 50%; border: 1px solid rgba(0, 0, 0, 0.1);"
          src="https://res.cloudinary.com/vernom/image/upload/v1635678562/hanoi_food_bank_project/users_avatar/null_avatar.jpg" alt="" class="navbar__user-img">
        `;
      // } else {
      //   var htmlsItem = `
      //   <img style="width: 30px; height: 30px; border-radius: 50%; border: 1px solid rgba(0, 0, 0, 0.1);"
      //     src="${objAccount.avatar}" alt="" class="navbar__user-img">
      //   `;
      // }
      // var htmlHiName = `<span>Hi ${objAccount.name}</span>`;

      // userName.innerHTML = htmlHiName;
      viewAccount.innerHTML = htmlsItem;

      Notification.show(account.data.id, function (listNotify) {
        var li = "";
        var quantityNotify = 0;
        if (listNotify == [] || listNotify == null || listNotify == undefined) {
          // li  += `
          //   <li >
          //   </li>
          // `;
        } else {
          listNotify.forEach(function (child) {
            if (child.val().status == 1) {
              quantityNotify++;
            }
            li += `
            <li class="header__notify-item header__notify-item--status-${
              child.val().status
            }" data-id="${child.key}">
              <a href="#" class="header__notify-link">
              <img src="https://res.cloudinary.com/vernom/image/upload/${
                child.val().avatar
              }" alt="" class="header__notify-img">
              <div class="header__notify-info">
                <span class="header__notify-name">${child.val().title}</span>
                <span class="header__notify-des">${child.val().message}</span>
              </div>
              </a>
            </li>
            `;
          });
          $("#notification").html(li);

          // console.log(111);
          if (quantityNotify == 0) {
            document.querySelector(".header__notify-notice").style.display =
              "none";
          } else if (quantityNotify > 9) {
            document.querySelector(".header__notify-notice").innerHTML = "9+";
          } else {
            document.querySelector(
              ".header__notify-notice"
            ).innerHTML = quantityNotify;
          }
        }
      });
      idAccount = account.data.id;
    })
    .catch((error) => console.log(error));
}

// status 0-deactive 1-active
$(document).on("click", ".header__notify-item", function () {
  var idNoti = $(this).data("id");
  var categoryNoti;
  var foodIdNoti;
  var usernameAccount;

  let notificationPromise = new Promise(function (myResolve) {
    Notification.update(idAccount, idNoti, {
      idNotify: idNoti,
    });
    console.log('idNotify: ' + idNoti)
    Notification.show(idAccount, function (listNotify) {
      listNotify.forEach(function (child) {
        if (child.val().idNotify == idNoti) {
          categoryNoti = child.val().category;
          foodIdNoti = child.val().foodid;
          usernameAccount = child.val().usernameaccount;
        }
      });
    });
    console.log(categoryNoti, foodIdNoti, usernameAccount)
    myResolve();
  });

  notificationPromise.then(function () {
    console.log("start notification");
    if (categoryNoti == "request") {
      console.log("start notification");
      Notification.update(idAccount, idNoti, {
        status: 0,
      });
    }
    if (categoryNoti == "food") {
      fetch(
        `https://hfb-t1098e.herokuapp.com/api/v1/hfb/users/roles?username=${usernameAccount}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((listRole) => {
          var listRoles;
          let notificationPromise2 = new Promise(function (myResolve) {
            listRoles = listRole.data;
            myResolve();
          });

          notificationPromise2.then(function () {
            listRoles.map(function (role) {
              if (role.name == "ROLE_ADMIN") {
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
                    var listAdmins;
                    let notificationPromise3 = new Promise(function (
                      myResolve
                    ) {
                      listAdmins = listAdmin.data;
                      myResolve();
                    });

                    notificationPromise3.then(function () {
                      listAdmins.map(function (admin) {
                        Notification.show(admin.id, function (listNotifyAdmin) {
                            listNotifyAdmin.forEach(function (child) {
                              if (child.val().foodid == foodIdNoti) {
                                var idNotiAdmin = child.val().idNotify;
                                Notification.update(admin.id, idNotiAdmin, {
                                  status: 0,
                                });
                              }
                            });
                        });
                      });
                    });
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              }
            });
          });}).catch(error => console.log(error))
    }
  })
})

// validate form
$("#addformModal").validate({
  onfocusout: false,
  onkeyup: false,
  onclick: false,
  rules: {
    nameFoodModal: {
      // name element not id
      required: true,
    },
    categoryModal: {
      required: true,
    },
    expirationDateModal: {
      required: true,
    },
    descriptionModal: {
      required: true,
    },
    contentModal: {
      required: true,
    },
  },
  messages: {
    nameFoodModal: {
      required: "Please provide name food.",
    },
    categoryModal: {
      required: "Please choose category.",
    },
    expirationDateModal: {
      required: "Please provide expiration date.",
    },
    descriptionModal: {
      required: "Please provide description.",
    },
    contentModal: {
      required: "Please provide content.",
    },
  },
});

var listImageFood = [];

function newFoodModal() {
  var nameFood = document.getElementById("nameFoodModal").value;
  var category = document.getElementById("categoryModal").value;
  var expirationDate = document.getElementById("expirationDateModal").value;
  var description = document.getElementById("descriptionModal").value;
  var content = document.getElementById("contentModal").value;

  if (
    !nameFood == false &&
    !category == false &&
    !expirationDate == false &&
    !description == false &&
    !content == false
  ) {
    if (listImageFood.length == 0) {
      swal("Warning!", "You need more image!", "warning");
    } else if(listImageFood.length > 3){
      swal("Warning!", "You should only add a maximum of 3 images!", "warning");
      console.log(listImageFood.length);
    } else {
      var dataPost = {
        name: nameFood || "",
        avatar: listImageFood[0],
        images: listImageFood.join(","),
        expirationDate: expirationDate,
        createdBy: objAccount.id,
        categoryId: parseInt(category),
        description: description,
        content: content,
      };
      fetch("https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataPost),
      })
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
                console.log(time);
                myResolve();
              });
              notifyFoodPromise.then(function () {
                listAdmin2.map(function (admin) {

                  Notification.send(admin.id, {
                    "idNotify": "",
                    "usernameaccount": admin.username,
                    "foodid": idFood,
                    "avatar": avatarFood,
                    "title": "User add new food",
                    "message": "Time request: " + time,
                    "category": "food",
                    "status": 1,
                  });
                });
              });
            })
            .catch(error => console.log(error));
          swal("Success!", "Add Food success!", "success");
        })
        .catch(error => console.log(error));
    }
  }
}

// food
var myWidgetFood = cloudinary.createUploadWidget(
  {
    cloudName: "vernom",
    uploadPreset: "fn5rpymu",
    form: "#addformModal",
    folder: "hanoi_food_bank_project/uploaded_food",
    fieldName: "thumbnailsFoodModal[]",
    thumbnails: ".thumbnailsFoodModal",
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      listImageFood.push(result.info.path);
      var arrayThumnailInputs = document.querySelectorAll(
        'input[name="thumbnailsFoodModal[]"]'
      );
      for (let i = 0; i < arrayThumnailInputs.length; i++) {
        arrayThumnailInputs[i].value = arrayThumnailInputs[i].getAttribute(
          "data-cloudinary-public-id"
        );
      }
    }
  }
);

document.getElementById("upload_image_foodModal").addEventListener(
  "click",
  function () {
    myWidgetFood.open();
  },
  false
);

$("body").on("click", ".cloudinary-delete", function () {
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
    if(listImageFood[i] == imgName2){
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

// hoangtl2 - 29/10/2021
// start

// Display add food modal on click button
var modal1 = document.querySelector(".modal-header-add-food");
function addNewFood() {
  var cookie = document.cookie;
  if (
    cookie === null ||
    cookie === undefined ||
    cookie === NaN ||
    cookie === "" ||
    cookie === []
  ) {
    location.replace("../login_register.html");
  } else {
    modal1.style.display = "flex";
  }
}

// Display donate modal on click button
var modal2 = document.querySelector(".modal-header-donate");
function donate() {
  modal2.style.display = "flex";
}

// Close Modal by clicking "close" button
function closeModal() {
  modal1.style.display = "none";
  modal2.style.display = "none";
}

// Close Modal by clicking "esc" button
$(document).keydown(function (event) {
  if (event.keyCode == 27) {
    modal1.style.display = "none";
    modal2.style.display = "none";
    event.preventDefault();
  }
});

// add Category as folder name for saving images to Cloudinary
$(document).ready(function () {
  $("select#category").change(function () {
    $(this)
      .find(":selected")
      .addClass("selected")
      .siblings("option")
      .removeClass("selected");
    var selectedCategory = $(this).children("option:selected").text();
    console.log(selectedCategory);
    myWidgetFood.update({
      folder: "hanoi_food_bank_project/uploaded_food/" + selectedCategory,
    });
  });
});

// Change navbar bg color on scroll
$(function () {
  $(document).scroll(function () {
    var $nav = $(".navbar-fixed-top");
    $nav.toggleClass("scrolled", $(this).scrollTop() > 2 * $nav.height());
  });
});

//end
