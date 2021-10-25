"use strict";
var objAccount = null, listImageFood = [];
function initPageAccount(){
  getAccount();
}
initPageAccount();
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
  ]
});

document.getElementById("newFood").addEventListener("click", function(){
    var nameFood = document.getElementById("nameFood").value;
    var category = document.getElementById("category").value;
    
    var expirationDate = document.getElementById("expirationDate").value;
    if (!expirationDate){
      $('.alert-danger').alert();
      return false;
    }
    if (listImageFood.length == 0) {
        $('.alert-danger').alert();
        return false;
    }
    var description = document.getElementById("description").value;
    var dataPost = {
        name: nameFood || '',
        avatar: listImageFood[0],
        images: listImageFood.join(","),
        expirationDate: document.getElementById("expirationDate").value,
        createdBy: objAccount.id,
        categoryId: parseInt(category),
        description: description
    }
        fetch('https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${isToken}`
            },
            body: JSON.stringify(dataPost)
        })
        .then(response => response.json())
        .then(function(data){
            
        })
        .catch(function(error){
            
        });
}, false);

var myWidget = cloudinary.createUploadWidget(
  {
    cloudName: "vernom",
    uploadPreset: "fn5rpymu",
    form: "#edit-account-form",
    folder: "hanoi_food_bank_project/users_avatar",
    fieldName: "thumbnails[]",
    thumbnails: ".thumbnails",
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      if (result.info) {
        document.querySelector('#avatar_account').src = result.info.url;
        document.querySelector('#account_avatar').value = result.info.url;
      }
    }
  }
);
// avatar
document.getElementById("upload_widget").addEventListener("click", function () {
    myWidget.open();
  },
  false
);
// food
var myWidgetFood = cloudinary.createUploadWidget(
  {
    cloudName: "vernom",
    uploadPreset: "fn5rpymu",
    form: "#edit-account-form",
    folder: "hanoi_food_bank_project/uploaded_food",
    fieldName: "thumbnailsFood[]",
    thumbnails: ".thumbnailsFood",
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      listImageFood.push(result.info.path);
      var arrayThumnailInputs = document.querySelectorAll(
        'input[name="thumbnailsFood[]"]'
      );
      for (let i = 0; i < arrayThumnailInputs.length; i++) {
        arrayThumnailInputs[i].value = arrayThumnailInputs[i].getAttribute(
          "data-cloudinary-public-id"
        );
        
      }
    }
  }
);
document.getElementById("upload_image_food").addEventListener("click", function () {
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
  $(`input[data-cloudinary-public-id="${imgName}"]`).remove();
});

// hiennv 24/10
// ********* active
function onAddClassActive(e, className, parent){
  var listAction = document.getElementsByClassName(className);
  if (listAction && listAction.length > 0) {
    for (let index = 0, len = listAction.length; index < len; index++) {
      var element = listAction[index];
      element.classList.remove('active');
    }
  }
  if (parent) {
    e.parentElement.classList.add("active");
  } else {
    e.classList.add("active");
  }
}
function showTabPanel(e) {
  var listAction = document.getElementsByClassName('tab-account');
  if (listAction && listAction.length > 0) {
    for (var index = 0, len = listAction.length; index < len; index++) {
      var element = listAction[index];
      element.classList.add('d-none');
      element.classList.remove('active');
    }
  }
  var listPanel = document.getElementsByClassName('tab-pane');
  if (listPanel && listPanel.length > 0) {
    for (var index = 0, len = listPanel.length; index < len; index++) {
      var element = listPanel[index];
      element.classList.remove('active');
    }
  }
  switch (e){
    case 'myaccount':
      document.getElementsByClassName('profile')[0].classList.add('active');
      document.getElementById('profile').classList.add('active');
      document.getElementsByClassName('profile')[0].classList.remove('d-none');
      getAccount();
      break;
    case 'myfood':
      document.getElementsByClassName('addFood')[0].classList.add('active');
      document.getElementById('addFood').classList.add('active');
      document.getElementsByClassName('addFood')[0].classList.remove('d-none');
      document.getElementsByClassName('listFood')[0].classList.remove('d-none');
      getListFood();
      break;
    case 'myrequest':
      document.getElementsByClassName('listRequest')[0].classList.add('active');
      document.getElementById('listRequest').classList.add('active');
      document.getElementsByClassName('listRequest')[0].classList.remove('d-none');
      document.getElementsByClassName('detailRequest')[0].classList.remove('d-none');
      break;
    case 'myfeedback':
      document.getElementsByClassName('feedback')[0].classList.add('active');
      document.getElementById('feedback').classList.add('active');
      document.getElementsByClassName('feedback')[0].classList.remove('d-none');
      break;
    default:
      break;
  }
}

// get data user
function getAccount (){
  fetch(`https://hfb-t1098e.herokuapp.com/api/v1/hfb/users/${currentName}`,{
    method: 'GET',
    headers: {
      "Authorization":`Bearer ${isToken}`
    }
  })
  .then(response => response.json())
  .then(account => {
    if (account && account.data) {
      objAccount = account.data;
      bindDataAccount(account.data);
    }
  })
  .catch(error => console.log(error));
}
function bindDataAccount(data){
  document.querySelector('#account_name').value = data.name;
  document.querySelector('#account_phone').value = data.phone;
  document.querySelector('#account_email').value = data.email;
  document.querySelector('#account_address').value = data.address;
  document.querySelector('.name-account').innerHTML = data.name;
  document.querySelector('#avatar_account').src = data.avatar
   || "https://thumbs.dreamstime.com/b/user-icon-trendy-flat-style-isolated-grey-background-user-symbol-user-icon-trendy-flat-style-isolated-grey-background-123663211.jpg";
  document.querySelector('#avatar_account').parentElement.href = data.avatar
  || "https://thumbs.dreamstime.com/b/user-icon-trendy-flat-style-isolated-grey-background-user-symbol-user-icon-trendy-flat-style-isolated-grey-background-123663211.jpg";
}

// update profile
function updateAccount(){
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

// get data food
function getListFood(){
  fetch('https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods/search?status=1',{
    method: 'GET',
    headers: {
      "Authorization":`Bearer ${isToken}`
    }
  })
  .then(response => response.json())
  .then(food => {
    if (food && food.data && food.data.content && food.data.content.length > 0) {
      document.querySelector('#list-food').innerHTML = renderListFood(food.data.content);
    }
  })
  .catch(error => console.log(error));
}

function renderListFood(data){
  var count = 0;
  var html = data.map(function (e){
    count++;
    return `<tr>
    <td>${count}</td>
    <td>${e.name || ''}</td>
    <td><img src="https://res.cloudinary.com/vernom/image/upload/${e.avatar || ''}" style="width: 30px;height: 30px;"/></td>
    <td>${e.categoryId || ''}</td>
    <td>${e.updatedAt}</td>
    <td>${e.expirationDate}</td>
    <td>${e.status}</td>
    <td>${e.createdAt}</td>
    <td onclick="formUpdateFood(${e})"><i class="fa fa-pencil-square-o"></i></td>
    <td onclick="deleteFood(${e})"><i class="fa fa-trash-o"></i></td>
  </tr>`;
  })
  return html;
}
// setTimeout(function(){
//   $('#addFood #manufactureDate').datetimepicker();
//   $('#addFood #expirationDate').datetimepicker();
// }, 0)